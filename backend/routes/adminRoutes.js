const express = require('express')
const router = express.Router()
const db = require('../db')
const { verifyToken, verifyRole } = require('../middleware/authMiddleware')

const isAdmin = [verifyToken, verifyRole(['admin'])]

router.get('/stats', ...isAdmin, async (req, res) => {
    try {
        const [[users]] = await db.promise().query('SELECT COUNT(*) AS total FROM users')
        const [[cands]] = await db.promise().query("SELECT COUNT(*) AS total FROM users WHERE role='candidate'")
        const [[recs]] = await db.promise().query("SELECT COUNT(*) AS total FROM users WHERE role='recruiter'")
        const [[jobs]] = await db.promise().query('SELECT COUNT(*) AS total FROM jobs')
        const [[active]] = await db.promise().query("SELECT COUNT(*) AS total FROM jobs WHERE status='active'")
        const [[apps]] = await db.promise().query('SELECT COUNT(*) AS total FROM applications')
        const [[hired]] = await db.promise().query("SELECT COUNT(*) AS total FROM applications WHERE status='hired'")

        const hiredRate = apps.total > 0
            ? ((hired.total / apps.total) * 100).toFixed(1) + '%'
            : '0%'

        res.json({
            totalUsers: users.total,
            totalCandidates: cands.total,
            totalRecruiters: recs.total,
            totalJobs: jobs.total,
            activeJobs: active.total,
            totalApplications: apps.total,
            hiredCount: hired.total,
            hiredRate
        })
    } catch (err) {
        console.error('Admin stats error:', err.message)
        res.status(500).json({ message: err.message })
    }
})

router.get('/users', ...isAdmin, async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            'SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC'
        )
        res.json({ data: rows })
    } catch (err) {
        console.error('Admin users error:', err.message)
        res.status(500).json({ message: err.message })
    }
})

router.delete('/users/:id', ...isAdmin, async (req, res) => {
    try {
        const { id } = req.params
        if (parseInt(id) === req.user.id)
            return res.status(400).json({ message: 'Không thể tự xóa tài khoản của mình' })

        const [[target]] = await db.promise().query('SELECT role FROM users WHERE id = ?', [id])
        if (!target) return res.status(404).json({ message: 'Không tìm thấy user' })
        if (target.role === 'admin')
            return res.status(403).json({ message: 'Không thể xóa tài khoản admin' })

        await db.promise().query('DELETE FROM users WHERE id = ?', [id])
        res.json({ message: 'Xóa user thành công' })
    } catch (err) {
        console.error('Admin delete error:', err.message)
        res.status(500).json({ message: err.message })
    }
})

module.exports = router