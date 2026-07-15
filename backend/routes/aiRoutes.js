const express = require('express')
const router = express.Router()
const { verifyToken, verifyRole } = require('../middleware/authMiddleware')
const aiService = require('../services/aiService')

// POST /api/ai/score-cv — recruiter chấm điểm CV
router.post('/score-cv', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    try {
        const { application_id } = req.body
        if (!application_id) return res.status(400).json({ message: 'Thiếu application_id' })

        const result = await aiService.scoreCV(application_id)
        res.json(result)
    } catch (err) {
        if (err.message === 'NOT_FOUND')
            return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' })
        console.error('AI score error:', err.message)
        res.status(500).json({ message: 'Lỗi AI, thử lại sau' })
    }
})

// POST /api/ai/generate-jd — recruiter sinh JD
router.post('/generate-jd', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    try {
        const { title, level, requirements, salary_range } = req.body
        if (!title || !level || !requirements)
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

        const jd = await aiService.generateJD({ title, level, requirements, salary_range })
        res.json({ jd })
    } catch (err) {
        console.error('AI JD error:', err.message)
        res.status(500).json({ message: 'Lỗi AI, thử lại sau' })
    }
})

// POST /api/ai/interview-questions — gợi ý câu hỏi
router.post('/interview-questions', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    try {
        const { job_title, level, focus } = req.body
        if (!job_title || !level)
            return res.status(400).json({ message: 'Thiếu job_title hoặc level' })

        const result = await aiService.generateInterviewQuestions({ job_title, level, focus })
        res.json(result)
    } catch (err) {
        console.error('AI questions error:', err.message)
        res.status(500).json({ message: 'Lỗi AI, thử lại sau' })
    }
})

// POST /api/ai/chat — chatbot
router.post('/chat', verifyToken, verifyRole(['recruiter']), async (req, res) => {
    try {
        const { message } = req.body
        if (!message) return res.status(400).json({ message: 'Thiếu message' })

        const reply = await aiService.chat(message)
        res.json({ reply })
    } catch (err) {
        console.error('AI chat error:', err.message)
        res.status(500).json({ message: 'Lỗi AI, thử lại sau' })
    }
})

module.exports = router