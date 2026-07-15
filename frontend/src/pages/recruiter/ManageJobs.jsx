import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Users, Loader2, X } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { jobService } from '../../services/jobService'

const EMPTY = { title: '', description: '', requirements: '', salary_min: '', salary_max: '', location: '', status: 'active' }

const Field = ({ label, name, required, textarea, type = 'text', half, form, onChange }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>
            {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
        {textarea
            ? <textarea name={name} value={form[name]} onChange={onChange} rows={4} className="input-field" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            : <input type={type} name={name} value={form[name]} onChange={onChange} className="input-field" />
        }
    </div>
)

function JobFormModal({ job, onClose, onSaved }) {
    const [form, setForm] = useState(job ? { ...job, salary_min: job.salary_min || '', salary_max: job.salary_max || '' } : EMPTY)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isEdit = !!job?.id

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.description.trim())
            return setError('Tiêu đề và mô tả là bắt buộc')

        setLoading(true)
        setError('')
        try {
            if (isEdit) await jobService.update(job.id, form)
            else await jobService.create(form)
            onSaved()
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: 'var(--c-surface)', borderRadius: 12, width: '100%', maxWidth: 560, padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--c-text)' }}>
                        {isEdit ? 'Sửa tin tuyển dụng' : 'Đăng tin mới'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)' }}><X size={18} /></button>
                </div>

                {error && <div style={{ padding: '0.7rem 1rem', marginBottom: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, fontSize: '0.85rem', color: '#DC2626' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                        <Field label="Tiêu đề vị trí" name="title" required form={form} onChange={handleChange} />
                        <Field label="Địa điểm" name="location" half form={form} onChange={handleChange} />
                        <Field label="Lương tối thiểu (đ)" name="salary_min" type="number" half form={form} onChange={handleChange} />
                        <Field label="Lương tối đa (đ)" name="salary_max" type="number" half form={form} onChange={handleChange} />
                        <Field label="Mô tả công việc" name="description" required textarea form={form} onChange={handleChange} />
                        <Field label="Yêu cầu ứng viên" name="requirements" textarea form={form} onChange={handleChange} />
                        {isEdit && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>Trạng thái</label>
                                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Huỷ</button>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                            {loading ? <><Loader2 size={14} className="animate-spin" /> Đang lưu...</> : (isEdit ? 'Lưu thay đổi' : 'Đăng tin')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function ManageJobs() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)   // null | 'create' | job object
    const [deleting, setDeleting] = useState(null)

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const { data } = await jobService.getAll({ mine: true, limit: 50 })
            setJobs(data.data)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchJobs() }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa tin này sẽ xóa tất cả đơn liên quan. Tiếp tục?')) return
        setDeleting(id)
        try {
            await jobService.remove(id)
            setJobs(j => j.filter(j => j.id !== id))
        } catch (err) { alert(err.response?.data?.message || 'Lỗi khi xóa') }
        finally { setDeleting(null) }
    }

    const statusStyle = (s) => ({
        active: { bg: '#ECFDF5', color: '#059669' },
        draft: { bg: '#F1F5F9', color: '#64748B' },
        closed: { bg: '#FEF2F2', color: '#DC2626' },
    }[s] || {})

    return (
        <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
            <Navbar />
            <div className="container-main" style={{ padding: '2rem 1rem' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--c-text)', marginBottom: '0.25rem' }}>Quản lý tuyển dụng</h1>
                        <p style={{ color: 'var(--c-text-muted)', fontSize: '0.9rem' }}>{jobs.length} tin đang đăng</p>
                    </div>
                    <button className="btn-primary" onClick={() => setModal('create')}>
                        <Plus size={15} /> Đăng tin mới
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 size={24} style={{ animation: 'spin 0.7s linear infinite', color: 'var(--c-primary)' }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-text-muted)' }}>
                        <p style={{ marginBottom: '1rem' }}>Bạn chưa có tin tuyển dụng nào.</p>
                        <button className="btn-primary" onClick={() => setModal('create')}><Plus size={14} /> Đăng tin đầu tiên</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {jobs.map(job => {
                            const s = statusStyle(job.status)
                            return (
                                <div key={job.id} className="card" style={{ padding: '1.1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.2rem' }}>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--c-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {job.title}
                                            </h3>
                                            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600, background: s.bg, color: s.color, flexShrink: 0 }}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--c-text-muted)' }}>
                                            {job.location || 'Chưa có địa điểm'} · {new Date(job.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <Link to={`/recruiter/apps/${job.id}`} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                                            <Users size={13} /> Xem đơn
                                        </Link>
                                        <button onClick={() => setModal(job)} className="btn-ghost" style={{ padding: '0.4rem 0.65rem' }}>
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(job.id)} disabled={deleting === job.id}
                                            style={{ padding: '0.4rem 0.65rem', borderRadius: 6, border: '1px solid var(--c-border)', background: 'none', cursor: 'pointer', color: '#DC2626', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA' }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--c-border)' }}>
                                            {deleting === job.id ? <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Trash2 size={14} />}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {modal && (
                <JobFormModal
                    job={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={() => { setModal(null); fetchJobs() }}
                />
            )}
        </div>
    )
}
