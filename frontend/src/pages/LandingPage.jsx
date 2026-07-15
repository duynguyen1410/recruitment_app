import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Users, FileText, BarChart3, CheckCircle2 } from 'lucide-react'

/* ── Data ────────────────────────────────────────────────── */
const stats = [
    { value: '3×', label: 'Nhanh hơn quy trình thủ công' },
    { value: '94%', label: 'Độ chính xác AI chấm điểm CV' },
    { value: '60%', label: 'Tiết kiệm thời gian recruiter' },
]

const features = [
    {
        icon: Sparkles,
        title: 'AI Chấm điểm CV',
        desc: 'Gemini AI phân tích CV, chấm điểm 0–100 và đưa ra nhận xét chi tiết về điểm mạnh, điểm yếu của từng ứng viên.',
    },
    {
        icon: FileText,
        title: 'Tự động sinh JD',
        desc: 'Nhập tiêu đề vị trí, AI sẽ tạo bản mô tả công việc đầy đủ, chuyên nghiệp chỉ trong vài giây.',
    },
    {
        icon: Users,
        title: 'Pipeline trực quan',
        desc: 'Theo dõi từng ứng viên qua 6 giai đoạn tuyển dụng với giao diện rõ ràng, dễ quản lý.',
    },
    {
        icon: BarChart3,
        title: 'Dashboard thống kê',
        desc: 'Tổng quan toàn bộ hoạt động tuyển dụng: số lượng đơn, tỷ lệ chuyển đổi, thống kê theo thời gian.',
    },
]

const roles = [
    {
        tag: 'Ứng viên',
        title: 'Tìm việc làm phù hợp',
        points: [
            'Xem toàn bộ tin tuyển dụng đang mở',
            'Nộp hồ sơ + upload CV PDF dễ dàng',
            'Theo dõi trạng thái đơn real-time',
        ],
        cta: 'Tìm việc ngay',
        href: '/register',
        style: 'light',
    },
    {
        tag: 'Recruiter',
        title: 'Tuyển dụng thông minh hơn',
        points: [
            'Đăng tin và quản lý ứng viên tập trung',
            'AI tự động chấm điểm và xếp hạng CV',
            'Chatbot hỗ trợ soạn câu hỏi phỏng vấn',
        ],
        cta: 'Bắt đầu miễn phí',
        href: '/register',
        style: 'dark',
    },
]

/* ── Components ──────────────────────────────────────────── */
function Navbar() {
    return (
        <header style={{ borderBottom: '1px solid var(--c-border)', background: 'rgba(250,250,249,0.92)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container-main flex items-center justify-between h-14">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--c-primary)' }}>
                    Recruit<em>AI</em>
                </span>
                <nav className="hidden md:flex items-center gap-6">
                    {['Tính năng', 'Quy trình', 'Vai trò'].map(item => (
                        <a key={item} href={`#${item}`}
                            style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.target.style.color = 'var(--c-text)'}
                            onMouseLeave={e => e.target.style.color = 'var(--c-text-muted)'}
                        >{item}</a>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <Link to="/login" className="btn-ghost" style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}>
                        Đăng nhập
                    </Link>
                    <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}>
                        Bắt đầu <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </header>
    )
}

function Hero() {
    return (
        <section style={{ paddingTop: '6rem', paddingBottom: '5rem', overflow: 'hidden', position: 'relative' }}>
            {/* Background subtle pattern */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(47,82,69,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(200,184,154,0.08) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />

            <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <div className="anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '4px 12px', borderRadius: '999px',
                        border: '1px solid var(--c-primary)', opacity: 0.85,
                        fontSize: '0.78rem', color: 'var(--c-primary)', fontWeight: 500,
                    }}>
                        <Sparkles size={11} /> Tích hợp Google Gemini AI
                    </span>
                </div>

                {/* Headline */}
                <h1 className="anim-fade-up delay-100" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
                    fontWeight: 400,
                    color: 'var(--c-text)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    maxWidth: '720px',
                    marginBottom: '1.5rem',
                }}>
                    Tuyển dụng thông minh,<br />
                    <em style={{ color: 'var(--c-primary)' }}>tiết kiệm thời gian.</em>
                </h1>

                {/* Sub */}
                <p className="anim-fade-up delay-200" style={{
                    fontSize: '1.05rem',
                    color: 'var(--c-text-muted)',
                    maxWidth: '480px',
                    lineHeight: 1.7,
                    marginBottom: '2.5rem',
                }}>
                    Nền tảng quản lý tuyển dụng end-to-end với AI tự động chấm điểm CV, sinh mô tả công việc và hỗ trợ recruiter đưa ra quyết định nhanh hơn.
                </p>

                {/* CTAs */}
                <div className="anim-fade-up delay-300 flex flex-wrap gap-3" style={{ marginBottom: '4rem' }}>
                    <Link to="/register" className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                        Bắt đầu miễn phí <ArrowRight size={15} />
                    </Link>
                    <Link to="/login" className="btn-ghost" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                        Đã có tài khoản?
                    </Link>
                </div>

                {/* Stats row */}
                <div className="anim-fade-up delay-400" style={{
                    display: 'flex', flexWrap: 'wrap', gap: '2.5rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--c-border)',
                }}>
                    {stats.map(({ value, label }) => (
                        <div key={label}>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--c-primary)', lineHeight: 1 }}>
                                {value}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--c-text-muted)', marginTop: '4px' }}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Features() {
    return (
        <section id="Tính năng" style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
            <div className="container-main page-section">
                {/* Label */}
                <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-primary)', marginBottom: '1rem' }}>
                    Tính năng
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--c-text)', marginBottom: '3.5rem', maxWidth: '480px' }}>
                    Mọi thứ bạn cần để tuyển đúng người
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5px', background: 'var(--c-border)' }}>
                    {features.map(({ icon: Icon, title, desc }, i) => (
                        <div key={title} style={{
                            background: 'var(--c-surface)',
                            padding: '2rem 1.75rem',
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--c-primary-l)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--c-surface)'}
                        >
                            <div style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: 'var(--c-primary-l)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.25rem',
                            }}>
                                <Icon size={17} color="var(--c-primary)" />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '0.6rem', color: 'var(--c-text)' }}>
                                {title}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', lineHeight: 1.65 }}>
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Process() {
    const steps = [
        { n: '01', title: 'Recruiter đăng tin', desc: 'Tạo tin tuyển dụng trong vài phút, hoặc để AI sinh JD tự động.' },
        { n: '02', title: 'Ứng viên nộp hồ sơ', desc: 'Ứng viên tìm kiếm, xem chi tiết và upload CV PDF dễ dàng.' },
        { n: '03', title: 'AI chấm điểm tự động', desc: 'Gemini AI đọc CV, đối chiếu JD và trả về điểm số + nhận xét.' },
        { n: '04', title: 'Recruiter ra quyết định', desc: 'Xem bảng xếp hạng, đổi trạng thái và tiến hành phỏng vấn.' },
    ]
    return (
        <section id="Quy trình" className="page-section">
            <div className="container-main">
                <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-primary)', marginBottom: '1rem' }}>
                    Quy trình
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--c-text)', marginBottom: '3.5rem' }}>
                    4 bước, từ tin đến offer
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {steps.map(({ n, title, desc }) => (
                        <div key={n}>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--c-border)', marginBottom: '0.75rem', lineHeight: 1 }}>{n}</p>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--c-text)', marginBottom: '0.5rem' }}>{title}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', lineHeight: 1.65 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Roles() {
    return (
        <section id="Vai trò" style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
            <div className="container-main page-section">
                <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-primary)', marginBottom: '1rem' }}>
                    Vai trò
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--c-text)', marginBottom: '3rem' }}>
                    Dành cho cả hai phía
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {roles.map(({ tag, title, points, cta, href, style }) => (
                        <div key={tag} className="card" style={{
                            padding: '2.25rem',
                            background: style === 'dark' ? 'var(--c-primary)' : 'var(--c-surface)',
                            borderColor: style === 'dark' ? 'var(--c-primary)' : 'var(--c-border)',
                        }}>
                            <span style={{
                                display: 'inline-block', marginBottom: '1rem',
                                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: style === 'dark' ? 'rgba(255,255,255,0.6)' : 'var(--c-text-muted)',
                            }}>{tag}</span>
                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                                color: style === 'dark' ? '#fff' : 'var(--c-text)',
                                marginBottom: '1.25rem',
                            }}>{title}</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {points.map(p => (
                                    <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: style === 'dark' ? 'rgba(255,255,255,0.8)' : 'var(--c-text-muted)' }}>
                                        <CheckCircle2 size={15} style={{ marginTop: 2, flexShrink: 0, color: style === 'dark' ? 'rgba(255,255,255,0.6)' : 'var(--c-primary)' }} />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                            <Link to={href} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                                color: style === 'dark' ? '#fff' : 'var(--c-primary)',
                                borderBottom: `1px solid ${style === 'dark' ? 'rgba(255,255,255,0.4)' : 'var(--c-primary)'}`,
                                paddingBottom: '1px', transition: 'opacity 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                {cta} <ArrowRight size={13} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--c-border)', padding: '2rem 0' }}>
            <div className="container-main flex flex-wrap items-center justify-between gap-4">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--c-text-muted)' }}>
                    Recruit<em>AI</em>
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--c-text-muted)' }}>
                    © 2024 · Built with React + Gemini AI
                </p>
            </div>
        </footer>
    )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
            <Navbar />
            <Hero />
            <Features />
            <Process />
            <Roles />
            <Footer />
        </div>
    )
}
