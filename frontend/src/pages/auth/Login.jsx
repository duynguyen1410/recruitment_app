import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

// ── Redirect theo role ────────────────────────────────────────
const roleRedirect = { candidate: '/candidate', recruiter: '/recruiter', admin: '/admin' }

export default function Login() {
    const navigate = useNavigate()
    const { loginUser } = useAuth()

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            setError('Vui lòng nhập đầy đủ thông tin')
            return
        }
        setLoading(true)
        setError('')
        try {
            const { data } = await authService.login(form)
            loginUser(data.user, data.token)
            navigate(roleRedirect[data.user.role] || '/')
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--c-bg)' }}>

            {/* ── Trái: Panel thương hiệu ────────────────────────── */}
            <div style={{
                flex: '0 0 42%', background: 'var(--c-primary)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', padding: '2.5rem',
            }} className="hidden md:flex">

                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff' }}>
                        Recruit<em>AI</em>
                    </span>
                </Link>

                {/* Quote giữa */}
                <div>
                    <p style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                        color: '#fff', lineHeight: 1.3, marginBottom: '1.25rem',
                        opacity: 0.95,
                    }}>
                        "Quyết định tuyển dụng tốt nhất bắt đầu từ thông tin tốt nhất."
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>
                        — RecruitAI Platform
                    </p>
                </div>

                {/* Decorative dots */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: i === 1 ? '#fff' : 'rgba(255,255,255,0.3)',
                        }} />
                    ))}
                </div>
            </div>

            {/* ── Phải: Form ─────────────────────────────────────── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '2rem',
            }}>
                <div style={{ width: '100%', maxWidth: 380 }} className="anim-fade-up">

                    {/* Mobile logo */}
                    <Link to="/" className="md:hidden" style={{ display: 'block', marginBottom: '2rem', textDecoration: 'none' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--c-primary)' }}>
                            Recruit<em>AI</em>
                        </span>
                    </Link>

                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.9rem',
                        color: 'var(--c-text)', marginBottom: '0.4rem',
                    }}>
                        Chào mừng trở lại
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', marginBottom: '2rem' }}>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 500 }}>
                            Đăng ký ngay
                        </Link>
                    </p>

                    {/* Error banner */}
                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem', marginBottom: '1.25rem',
                            background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: 6, fontSize: '0.85rem', color: '#DC2626',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="ten@email.com"
                                className="input-field"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>
                                Mật khẩu
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input-field"
                                    style={{ paddingRight: '2.5rem' }}
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--c-text-muted)', padding: 0,
                                    }}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ justifyContent: 'center', marginTop: '0.25rem', padding: '0.7rem', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading
                                ? <><Loader2 size={15} className="animate-spin" /> Đang đăng nhập...</>
                                : <>Đăng nhập <ArrowRight size={15} /></>
                            }
                        </button>
                    </form>

                    {/* Demo accounts */}
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--c-border)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--c-text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>
                            TÀI KHOẢN DEMO
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {[
                                { label: 'Admin', email: 'admin@test.com', pw: 'password' },
                            ].map(({ label, email, pw }) => (
                                <button key={label} type="button"
                                    onClick={() => setForm({ email, password: pw })}
                                    style={{
                                        textAlign: 'left', background: 'none', border: '1px solid var(--c-border)',
                                        borderRadius: 6, padding: '0.5rem 0.75rem', cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--c-primary)'
                                        e.currentTarget.style.background = 'var(--c-primary-l)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--c-border)'
                                        e.currentTarget.style.background = 'none'
                                    }}
                                >
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-primary)', display: 'block' }}>{label}</span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--c-text-muted)' }}>{email} / {pw}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
