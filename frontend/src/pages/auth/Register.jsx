import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Loader2, Briefcase, User } from 'lucide-react'
import { authService } from '../../services/authService'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        full_name: '', email: '', password: '', role: 'candidate'
    })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { full_name, email, password } = form
        if (!full_name.trim() || !email || !password)
            return setError('Vui lòng điền đầy đủ thông tin')
        if (password.length < 6)
            return setError('Mật khẩu phải ít nhất 6 ký tự')

        setLoading(true)
        setError('')
        try {
            await authService.register(form)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại')
        } finally {
            setLoading(false)
        }
    }

    // ── Success state ─────────────────────────────────────────
    if (success) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'var(--c-bg)',
            }}>
                <div className="anim-fade-up" style={{ textAlign: 'center', maxWidth: 360 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'var(--c-primary-l)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                        Đăng ký thành công!
                    </h2>
                    <p style={{ color: 'var(--c-text-muted)', fontSize: '0.875rem' }}>
                        Đang chuyển đến trang đăng nhập...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--c-bg)' }}>

            {/* ── Trái: Panel ──────────────────────────────────── */}
            <div style={{
                flex: '0 0 42%', background: '#171614',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', padding: '2.5rem',
            }} className="hidden md:flex">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff' }}>
                        Recruit<em>AI</em>
                    </span>
                </Link>

                <div>
                    <p style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                        color: '#fff', lineHeight: 1.35, marginBottom: '1.25rem',
                    }}>
                        Tham gia cùng hàng trăm recruiter đang tuyển dụng thông minh hơn mỗi ngày.
                    </p>
                    {/* Stat pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { v: '500+', l: 'Tin tuyển dụng đang mở' },
                            { v: '2,000+', l: 'Ứng viên đã đăng ký' },
                            { v: '94%', l: 'Hài lòng với kết quả AI' },
                        ].map(({ v, l }) => (
                            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{
                                    fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--c-accent)',
                                    minWidth: 60,
                                }}>{v}</span>
                                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                    © 2024 RecruitAI
                </p>
            </div>

            {/* ── Phải: Form ───────────────────────────────────── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '2rem',
                overflowY: 'auto',
            }}>
                <div style={{ width: '100%', maxWidth: 400 }} className="anim-fade-up">

                    <Link to="/" className="md:hidden" style={{ display: 'block', marginBottom: '2rem', textDecoration: 'none' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--c-primary)' }}>
                            Recruit<em>AI</em>
                        </span>
                    </Link>

                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--c-text)', marginBottom: '0.4rem' }}>
                        Tạo tài khoản
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', marginBottom: '1.75rem' }}>
                        Đã có tài khoản?{' '}
                        <Link to="/login" style={{ color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 500 }}>
                            Đăng nhập
                        </Link>
                    </p>

                    {/* Role selector */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)', marginBottom: 8 }}>
                            Bạn là
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { value: 'candidate', label: 'Ứng viên', icon: User, desc: 'Tìm việc làm' },
                                { value: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Tuyển dụng' },
                            ].map(({ value, label, icon: Icon, desc }) => {
                                const active = form.role === value
                                return (
                                    <button key={value} type="button"
                                        onClick={() => setForm(f => ({ ...f, role: value }))}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '0.7rem 0.9rem', borderRadius: 8, cursor: 'pointer',
                                            border: `1.5px solid ${active ? 'var(--c-primary)' : 'var(--c-border)'}`,
                                            background: active ? 'var(--c-primary-l)' : 'var(--c-surface)',
                                            transition: 'all 0.15s', textAlign: 'left',
                                        }}
                                    >
                                        <div style={{
                                            width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                                            background: active ? 'var(--c-primary)' : 'var(--c-muted, #f1f0ed)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Icon size={14} color={active ? '#fff' : 'var(--c-text-muted)'} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: active ? 'var(--c-primary)' : 'var(--c-text)', margin: 0 }}>{label}</p>
                                            <p style={{ fontSize: '0.72rem', color: 'var(--c-text-muted)', margin: 0 }}>{desc}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem', marginBottom: '1rem',
                            background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: 6, fontSize: '0.85rem', color: '#DC2626',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

                        {/* Họ tên */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                className="input-field"
                                disabled={loading}
                            />
                        </div>

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
                                    placeholder="Ít nhất 6 ký tự"
                                    className="input-field"
                                    style={{ paddingRight: '2.5rem' }}
                                    disabled={loading}
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', padding: 0,
                                    }}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {/* Password strength hint */}
                            {form.password.length > 0 && (
                                <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{
                                            height: 3, flex: 1, borderRadius: 99,
                                            background: form.password.length >= i * 3
                                                ? (form.password.length >= 8 ? 'var(--c-primary)' : 'var(--s-screening)')
                                                : 'var(--c-border)',
                                            transition: 'background 0.3s',
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ justifyContent: 'center', marginTop: '0.25rem', padding: '0.7rem', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading
                                ? <><Loader2 size={15} className="animate-spin" /> Đang đăng ký...</>
                                : <>Tạo tài khoản <ArrowRight size={15} /></>
                            }
                        </button>

                    </form>

                    <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--c-text-muted)', lineHeight: 1.6 }}>
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <span style={{ color: 'var(--c-primary)', cursor: 'pointer' }}>Điều khoản sử dụng</span>
                        {' '}và{' '}
                        <span style={{ color: 'var(--c-primary)', cursor: 'pointer' }}>Chính sách bảo mật</span>.
                    </p>

                </div>
            </div>

        </div>
    )
}
