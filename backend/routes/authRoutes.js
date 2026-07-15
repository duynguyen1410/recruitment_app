const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const db = require('../db')
const { verifyToken } = require('../middleware/authMiddleware')

// Helpers 
const signToken = (user) =>
    jwt.sign(
        { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
    )

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { full_name, email, password, role } = req.body

    // Validate
    if (!full_name || !email || !password)
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })

    const allowedRoles = ['candidate', 'recruiter']
    const userRole = allowedRoles.includes(role) ? role : 'candidate'

    if (password.length < 6)
        return res.status(400).json({ message: 'Mật khẩu phải ít nhất 6 ký tự' })

    try {
        // Check email tồn tại
        const [existing] = await db.promise().query(
            'SELECT id FROM users WHERE email = ?', [email]
        )
        if (existing.length > 0)
            return res.status(400).json({ message: 'Email đã được sử dụng' })

        // Hash password
        const hashed = await bcrypt.hash(password, 10)

        // Insert
        await db.promise().query(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [full_name.trim(), email.toLowerCase().trim(), hashed, userRole]
        )

        res.status(201).json({ message: 'Đăng ký thành công' })
    } catch (err) {
        console.error('Register error:', err.message)
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]
        )
        if (rows.length === 0)
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu' })

        const user = rows[0]
        const match = await bcrypt.compare(password, user.password)
        if (!match)
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu' })

        const token = signToken(user)
        const { password: _, ...safeUser } = user

        res.json({ token, user: safeUser })
    } catch (err) {
        console.error('Login error:', err.message)
        res.status(500).json({ message: 'Lỗi server' })
    }
})

// GET /api/auth/me 
router.get('/me', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        )
        if (rows.length === 0)
            return res.status(404).json({ message: 'Không tìm thấy người dùng' })

        res.json({ user: rows[0] })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' })
    }
})

module.exports = router