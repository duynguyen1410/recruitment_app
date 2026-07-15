const jwt = require('jsonwebtoken')

// verifyToken 
// Gắn vào bất kỳ route nào cần đăng nhập
// Dùng: router.get('/protected', verifyToken, handler)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]   // "Bearer <token>"

    if (!token)
        return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' })

    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch (err) {
        const msg = err.name === 'TokenExpiredError'
            ? 'Token đã hết hạn, vui lòng đăng nhập lại'
            : 'Token không hợp lệ'
        res.status(401).json({ message: msg })
    }
}

//  verifyRole 
// Dùng SAU verifyToken
// Dùng: router.post('/jobs', verifyToken, verifyRole(['recruiter']), handler)
const verifyRole = (roles) => (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: 'Chưa xác thực' })

    if (!roles.includes(req.user.role))
        return res.status(403).json({
            message: `Không có quyền truy cập. Yêu cầu role: ${roles.join(' hoặc ')}`
        })

    next()
}

module.exports = { verifyToken, verifyRole }