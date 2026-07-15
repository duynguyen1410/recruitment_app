const express = require('express')
const router = express.Router()
const db = require('../db')
const { verifyToken, verifyRole } = require('../middleware/authMiddleware')

// GET /api/jobs — Danh sách public
router.get('/', async (req, res) => {
    const { search, location, page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    try {
        let where = ['j.status = "active"'], params = []
        if (search) { where.push('(j.title LIKE ? OR j.description LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }
        if (location) { where.push('j.location LIKE ?'); params.push(`%${location}%`) }
        const whereStr = 'WHERE ' + where.join(' AND ')

        const [rows] = await db.promise().query(
            `SELECT j.*, u.full_name AS recruiter_name FROM jobs j JOIN users u ON j.recruiter_id = u.id ${whereStr} ORDER BY j.created_at DESC LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        )
        const [[{ total }]] = await db.promise().query(
            `SELECT COUNT(*) AS total FROM jobs j ${whereStr}`, params
        )
        res.json({ data: rows, total, page: parseInt(page), limit: parseInt(limit) })
    } catch (err) {
        console.error('Get jobs error:', err.message)
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// GET /api/jobs/my — Jobs của recruiter
router.get('/my', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
      SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS application_count
      FROM jobs j WHERE j.recruiter_id = ? ORDER BY j.created_at DESC
    `, [req.user.id])
        res.json({ data: rows })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// GET /api/jobs/:id — Chi tiết
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT j.*, u.full_name AS recruiter_name FROM jobs j JOIN users u ON j.recruiter_id = u.id WHERE j.id = ?`,
            [req.params.id]
        )
        if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng' })
        res.json({ data: rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// POST /api/jobs — Tạo job
router.post('/', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    const { title, description, requirements, salary_min, salary_max, location } = req.body
    if (!title || !description)
        return res.status(400).json({ message: 'Tiêu đề và mô tả là bắt buộc' })
    try {
        const [result] = await db.promise().query(
            'INSERT INTO jobs (title, description, requirements, salary_min, salary_max, location, recruiter_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, requirements || null, salary_min || null, salary_max || null, location || null, req.user.id]
        )
        res.status(201).json({ message: 'Tạo tin tuyển dụng thành công', job_id: result.insertId })
    } catch (err) {
        console.error('Create job error:', err.message)
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// PUT /api/jobs/:id — Cập nhật
router.put('/:id', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    const { title, description, requirements, salary_min, salary_max, location, status } = req.body
    try {
        const [rows] = await db.promise().query('SELECT recruiter_id FROM jobs WHERE id = ?', [req.params.id])
        if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng' })
        if (rows[0].recruiter_id !== req.user.id) return res.status(403).json({ message: 'Không có quyền chỉnh sửa tin này' })
        await db.promise().query(
            'UPDATE jobs SET title=?, description=?, requirements=?, salary_min=?, salary_max=?, location=?, status=? WHERE id=?',
            [title, description, requirements, salary_min, salary_max, location, status || 'active', req.params.id]
        )
        res.json({ message: 'Cập nhật thành công' })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// DELETE /api/jobs/:id — Xóa
router.delete('/:id', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT recruiter_id FROM jobs WHERE id = ?', [req.params.id])
        if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng' })
        if (rows[0].recruiter_id !== req.user.id) return res.status(403).json({ message: 'Không có quyền xóa tin này' })
        await db.promise().query('DELETE FROM jobs WHERE id = ?', [req.params.id])
        res.json({ message: 'Đã xóa tin tuyển dụng' })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

module.exports = router