require('dotenv').config()
const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'recruitment_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL   →  Kết nối thất bại:', err.message)
        return
    }
    console.log('MySQL   →  Kết nối thành công!')
    connection.release()
})

module.exports = pool
