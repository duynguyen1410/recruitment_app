const express = require('express')
const router = express.Router()
const db = require('../db')
const upload = require('../middleware/uploadMiddleware')
const { verifyToken, verifyRole } = require('../middleware/authMiddleware')

const VALID_STATUSES = ['screening', 'interview', 'offer', 'hired', 'rejected']

// POST /api/applications — Nộp hồ sơ
router.post('/', verifyToken, verifyRole(['candidate']),
    upload.single('cv'), async (req, res) => {
        const { job_id, cover_letter } = req.body
        if (!job_id) return res.status(400).json({ message: 'Thiếu job_id' })
        try {
            const [jobs] = await db.promise().query(
                'SELECT id FROM jobs WHERE id = ? AND status = "active"', [job_id]
            )
            if (jobs.length === 0)
                return res.status(404).json({ message: 'Tin tuyển dụng không tồn tại hoặc đã đóng' })

            const [existing] = await db.promise().query(
                'SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?',
                [job_id, req.user.id]
            )
            if (existing.length > 0)
                return res.status(400).json({ message: 'Bạn đã nộp hồ sơ cho vị trí này rồi' })

            const cvPath = req.file ? req.file.path.replace(/\\/g, '/') : null
            const [result] = await db.promise().query(
                'INSERT INTO applications (job_id, candidate_id, cv_path, cover_letter) VALUES (?, ?, ?, ?)',
                [job_id, req.user.id, cvPath, cover_letter || null]
            )
            res.status(201).json({ message: 'Nộp hồ sơ thành công', application_id: result.insertId })
        } catch (err) {
            console.error('Apply error:', err.message)
            res.status(500).json({ message: 'Lỗi server' })
        }
    }
)

// GET /api/applications/my — Đơn của candidate
router.get('/my', verifyToken, verifyRole(['candidate']), async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
      SELECT a.*, j.title AS job_title, j.location, u.full_name AS recruiter_name
      FROM applications a
      JOIN jobs j  ON a.job_id = j.id
      JOIN users u ON j.recruiter_id = u.id
      WHERE a.candidate_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id])
        res.json({ data: rows })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// GET /api/applications/job/:job_id — Đơn theo job (recruiter)
router.get('/job/:job_id', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    const { status } = req.query
    try {
        const [jobs] = await db.promise().query(
            'SELECT recruiter_id FROM jobs WHERE id = ?', [req.params.job_id]
        )
        if (jobs.length === 0) return res.status(404).json({ message: 'Không tìm thấy job' })
        if (jobs[0].recruiter_id !== req.user.id)
            return res.status(403).json({ message: 'Không có quyền xem đơn của job này' })

        let sql = `
      SELECT a.*, u.full_name AS candidate_name, u.email AS candidate_email, j.title AS job_title
      FROM applications a
      JOIN users u ON a.candidate_id = u.id
      JOIN jobs j  ON a.job_id = j.id
      WHERE a.job_id = ?
    `
        const params = [req.params.job_id]
        if (status) { sql += ' AND a.status = ?'; params.push(status) }
        sql += ' ORDER BY a.ai_score DESC, a.created_at DESC'

        const [rows] = await db.promise().query(sql, params)
        res.json({ data: rows })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// PUT /api/applications/:id/status — Đổi trạng thái
router.put('/:id/status', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    const { status } = req.body
    if (!VALID_STATUSES.includes(status))
        return res.status(400).json({ message: `Trạng thái không hợp lệ. Phải là: ${VALID_STATUSES.join(', ')}` })
    try {
        const [rows] = await db.promise().query(`
      SELECT a.id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ? AND j.recruiter_id = ?
    `, [req.params.id, req.user.id])
        if (rows.length === 0)
            return res.status(403).json({ message: 'Không có quyền cập nhật đơn này' })

        await db.promise().query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id])
        res.json({ message: 'Cập nhật trạng thái thành công' })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

module.exports = router