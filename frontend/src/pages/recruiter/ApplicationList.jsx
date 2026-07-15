import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Loader2, ExternalLink } from 'lucide-react'
import Navbar from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import { applicationService, jobService } from '../../services/jobService'

const STATUSES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']

export default function ApplicationList() {
    const { jobId } = useParams()
    const [job, setJob] = useState(null)
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [updating, setUpdating] = useState(null)
    const [viewingCV, setViewingCV] = useState(null)

    useEffect(() => {
        Promise.all([
            jobService.getById(jobId),
            applicationService.getByJob(jobId),
        ]).then(([jobRes, appsRes]) => {
            setJob(jobRes.data.data)
            setApps(appsRes.data.data)
        }).catch(console.error)
            .finally(() => setLoading(false))
    }, [jobId])

    const handleStatusChange = async (appId, status) => {
        setUpdating(appId)
        try {
            await applicationService.updateStatus(appId, status)
            setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi cập nhật')
        } finally {
            setUpdating(null)
        }
    }

    const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

    const scoreColor = (s) => {
        if (s === null || s === undefined) return 'var(--c-text-muted)'
        if (s >= 80) return 'var(--s-hired)'
        if (s >= 60) return 'var(--s-screening)'
        return 'var(--s-rejected)'
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
            <Navbar />
            <div className="container-main" style={{ padding: '2rem 1rem' }}>

                <Link to="/recruiter" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--c-text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
                    <ArrowLeft size={14} /> Quay lại
                </Link>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 size={24} style={{ animation: 'spin 0.7s linear infinite', color: 'var(--c-primary)' }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--c-text)', marginBottom: '0.25rem' }}>
                                {job?.title}
                            </h1>
                            <p style={{ color: 'var(--c-text-muted)', fontSize: '0.9rem' }}>
                                {apps.length} ứng viên đã nộp hồ sơ
                            </p>
                        </div>

                        {/* Pipeline stats */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
                            {[{ value: 'all', label: 'Tất cả', count: apps.length },
                            ...STATUSES.map(s => ({ value: s, label: s, count: apps.filter(a => a.status === s).length }))
                            ].map(({ value, label, count }) => (
                                <button key={value} onClick={() => setFilter(value)} style={{
                                    padding: '0.4rem 0.9rem', borderRadius: 999,
                                    border: '1px solid',
                                    borderColor: filter === value ? 'var(--c-primary)' : 'var(--c-border)',
                                    background: filter === value ? 'var(--c-primary-l)' : 'transparent',
                                    color: filter === value ? 'var(--c-primary)' : 'var(--c-text-muted)',
                                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: filter === value ? 500 : 400,
                                    transition: 'all 0.15s',
                                }}>
                                    {label} <span style={{ opacity: 0.7 }}>({count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-text-muted)' }}>
                                <FileText size={36} style={{ marginBottom: 10, opacity: 0.3 }} />
                                <p>Không có đơn nào ở trạng thái này.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {filtered.map(app => (
                                    <div key={app.id} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                        <div className="card" style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1rem' }}>

                                            {/* Candidate info */}
                                            <div>
                                                <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--c-text)', marginBottom: '0.15rem' }}>
                                                    {app.candidate_name}
                                                </p>
                                                <p style={{ fontSize: '0.78rem', color: 'var(--c-text-muted)' }}>{app.candidate_email}</p>
                                            </div>

                                            {/* AI Score */}
                                            <div style={{ textAlign: 'center', minWidth: 60 }}>
                                                {app.ai_score !== null ? (
                                                    <>
                                                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: scoreColor(app.ai_score), lineHeight: 1 }}>
                                                            {app.ai_score}
                                                        </p>
                                                        <p style={{ fontSize: '0.65rem', color: 'var(--c-text-muted)' }}>AI score</p>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--c-text-muted)' }}>—</span>
                                                )}
                                            </div>

                                            {/* Status + change */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <StatusBadge status={app.status} size="sm" />
                                                <select
                                                    value={app.status}
                                                    onChange={e => handleStatusChange(app.id, e.target.value)}
                                                    disabled={updating === app.id}
                                                    style={{
                                                        fontSize: '0.75rem', padding: '0.25rem 0.5rem',
                                                        border: '1px solid var(--c-border)', borderRadius: 6,
                                                        background: 'var(--c-surface)', color: 'var(--c-text)',
                                                        cursor: 'pointer', outline: 'none',
                                                    }}
                                                >
                                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                {updating === app.id && <Loader2 size={12} style={{ animation: 'spin 0.7s linear infinite', color: 'var(--c-primary)' }} />}
                                            </div>

                                            {/* CV link */}
                                            {app.cv_path ? (
                                                <button
                                                    onClick={() => setViewingCV(viewingCV === app.id ? null : app.id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--c-primary)', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                    <FileText size={13} /> {viewingCV === app.id ? 'Đóng CV' : 'Xem CV'} <ExternalLink size={11} />
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--c-text-muted)' }}>Không có CV</span>
                                            )}
                                        </div>
                                        {/* CV iframe */}
                                        {viewingCV === app.id && app.cv_path && (
                                            <div style={{ border: '1px solid var(--c-border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                                                <iframe
                                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(app.cv_path)}&embedded=true`}
                                                    width="100%"
                                                    height="600px"
                                                    style={{ display: 'block', border: 'none' }}
                                                    title="CV Preview"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}