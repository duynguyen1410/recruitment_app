import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from "../services/authService";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)   // check session khi app load

    // Khởi tạo: đọc từ localStorage và verify token
    useEffect(() => {
        const stored = localStorage.getItem('recruit_user')
        const token = localStorage.getItem('recruit_token')
        if (stored && token) {
            setUser(JSON.parse(stored))
        }
        setLoading(false)
    }, [])

    const loginUser = useCallback((userData, token) => {
        localStorage.setItem('recruit_user', JSON.stringify(userData))
        localStorage.setItem('recruit_token', token)
        setUser(userData)
    }, [])

    const logoutUser = useCallback(() => {
        localStorage.removeItem('recruit_user')
        localStorage.removeItem('recruit_token')
        setUser(null)
    }, [])

    const getToken = useCallback(() => localStorage.getItem('recruit_token'), [])

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, getToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider')
    return ctx
}
