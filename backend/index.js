const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const db = require('./db')

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/jobs', require('./routes/jobRoutes'))
app.use('/api/applications', require('./routes/applicationRoutes'))
app.use('/api/ai', require('./routes/aiRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))


app.get('/', (req, res) => {
    res.json({
        message: 'AI Recruitment API đang chạy',
        version: '1.0.0',
        status: 'OK',
        timestamp: new Date().toISOString()
    })
})

app.get('/health', (req, res) => {
    db.query('SELECT 1 AS ok', (err) => {
        if (err) return res.status(500).json({ db: 'FAIL', error: err.message })
        res.json({ db: 'OK', api: 'OK' })
    })
})

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} không tồn tại` })
})

app.use((err, req, res, next) => {
    console.error('Server error:', err.message)
    res.status(500).json({ message: 'Lỗi server nội bộ' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`  Server  →  http://localhost:${PORT}`)
    console.log(`  Health  →  http://localhost:${PORT}/health`)
})
