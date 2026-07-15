const { GoogleGenerativeAI } = require('@google/generative-ai')
const pdfParse = require('pdf-parse')
const fs = require('fs')
const db = require('../db')

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

// ── Hàm dùng chung ─────────────────────────────────────────────
async function callGemini(prompt) {
    const result = await model.generateContent(prompt)
    return result.response.text()
}

// ── 1. Chấm điểm CV ────────────────────────────────────────────
async function scoreCV(applicationId) {
    // Lấy thông tin đơn + job từ DB
    const [rows] = await db.promise().query(`
    SELECT a.cv_path, a.cover_letter,
           j.title, j.description, j.requirements
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ?
  `, [applicationId])

    if (!rows.length) throw new Error('NOT_FOUND')

    const { cv_path, cover_letter, title, description, requirements } = rows[0]

    // Đọc nội dung CV PDF
    let cvText = '(Không đọc được nội dung CV)'
    try {
        const pdfBuffer = fs.readFileSync(cv_path)
        const pdfData = await pdfParse(pdfBuffer)
        cvText = pdfData.text.slice(0, 3000) // giới hạn để tránh vượt token
    } catch (e) {
        console.error('pdf-parse error:', e.message)
    }

    const prompt = `
Bạn là chuyên gia tuyển dụng. Hãy chấm điểm CV sau cho vị trí "${title}".

== YÊU CẦU CÔNG VIỆC ==
${requirements}

== MÔ TẢ CÔNG VIỆC ==
${description}

== NỘI DUNG CV ==
${cvText}

== THƯ XIN VIỆC ==
${cover_letter || '(Không có)'}

Hãy trả về JSON với cấu trúc sau (KHÔNG có backtick, KHÔNG markdown, chỉ JSON thuần):
{
  "score": <số từ 0 đến 100>,
  "strengths": ["điểm mạnh 1", "điểm mạnh 2", "điểm mạnh 3"],
  "weaknesses": ["điểm yếu 1", "điểm yếu 2"],
  "recommendation": "<nhận xét tổng thể và đề xuất bước tiếp theo>"
}
`

    const raw = await callGemini(prompt)
    let parsed
    try {
        parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    } catch {
        parsed = { score: 50, strengths: [], weaknesses: [], recommendation: raw }
    }

    // Lưu kết quả vào DB
    await db.promise().query(
        'UPDATE applications SET ai_score = ?, ai_feedback = ? WHERE id = ?',
        [parsed.score, parsed.recommendation, applicationId]
    )

    return parsed
}

// ── 2. Sinh mô tả công việc ────────────────────────────────────
async function generateJD({ title, level, requirements, salary_range }) {
    const prompt = `
Bạn là chuyên gia tuyển dụng tại Việt Nam. Hãy viết mô tả công việc (JD) chuyên nghiệp bằng tiếng Việt cho vị trí sau:

- Chức danh: ${title}
- Cấp độ: ${level}
- Kỹ năng yêu cầu: ${requirements}
- Mức lương: ${salary_range}

JD phải gồm: Mô tả công việc, Yêu cầu ứng viên, Quyền lợi, Thông tin ứng tuyển.
Viết tự nhiên, thu hút ứng viên giỏi. Độ dài khoảng 300–400 từ.
`
    return await callGemini(prompt)
}

// ── 3. Câu hỏi phỏng vấn ──────────────────────────────────────
async function generateInterviewQuestions({ job_title, level, focus }) {
    const focusStr = Array.isArray(focus) ? focus.join(', ') : focus
    const prompt = `
Bạn là interviewer giàu kinh nghiệm. Hãy tạo 10 câu hỏi phỏng vấn bằng tiếng Việt cho vị trí:

- Chức danh: ${job_title}
- Cấp độ: ${level}
- Trọng tâm kỹ thuật: ${focusStr || 'tổng quát'}

Trả về JSON (KHÔNG có backtick):
{
  "questions": [
    { "category": "Kỹ thuật|Tình huống|Hành vi|Văn hóa", "question": "..." }
  ]
}
`
    const raw = await callGemini(prompt)
    try {
        return JSON.parse(raw.replace(/```json|```/g, '').trim())
    } catch {
        return { questions: [{ category: 'Tổng quát', question: raw }] }
    }
}

// ── 4. Chatbot ────────────────────────────────────────────────
async function chat(message) {
    const prompt = `
Bạn là trợ lý tuyển dụng AI chuyên nghiệp, hỗ trợ recruiter Việt Nam.
Chỉ trả lời các câu hỏi liên quan đến tuyển dụng, HR, đánh giá ứng viên.
Câu hỏi: ${message}
`
    return await callGemini(prompt)
}

module.exports = { scoreCV, generateJD, generateInterviewQuestions, chat }