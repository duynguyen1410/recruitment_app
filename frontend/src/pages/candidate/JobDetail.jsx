import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Banknote, ArrowLeft, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { jobService, applicationService } from '@/services/jobService'

const fmt = (n) => n
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact', maximumFractionDigits: 0 }).format(n)
    : null

export default function JobDetail() {
    const { id } = useParams()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [cvFile, setCvFile] = useState(null)
    const [coverLetter, setCoverLetter] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState(null)
    const [applied, setApplied] = useState(false)

    useEffect(() => {
        jobService.getById(id)
            .then(({ data }) => setJob(data.data))
            .catch(() => setJob(null))
            .finally(() => setLoading(false))
    }, [id])

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    const handleApply = async (e) => {
        e.preventDefault()
        if (!cvFile) return showToast('Vui lòng chọn file CV', 'error')
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('job_id', id)
            fd.append('cv', cvFile)
            fd.append('cover_letter', coverLetter)
            await applicationService.apply(fd)
            setApplied(true)
            setShowModal(false)
            showToast('Nộp hồ sơ thành công!')
        } catch (err) {
            showToast(err.response?.data?.message || 'Nộp hồ sơ thất bại', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        </div>
    )

    if (!job) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <p className="text-gray-500 text-lg">Không tìm thấy tin tuyển dụng</p>
                <Link to="/candidate">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                    </Button>
                </Link>
            </div>
        </div>
    )

    const salary = job.salary_min && job.salary_max
        ? `${fmt(job.salary_min)} – ${fmt(job.salary_max)}`
        : 'Thoả thuận'

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-md border transition-all
          ${toast.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'}`}
                >
                    {toast.type === 'success'
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <X className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Link
                    to="/candidate"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Về danh sách việc làm
                </Link>

                {/* Job header card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                    <p className="text-sm text-gray-500 mb-5">Đăng bởi {job.recruiter_name}</p>

                    <div className="flex flex-wrap gap-4 pb-5 mb-5 border-b border-gray-100">
                        {job.location && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <MapPin className="w-4 h-4" /> {job.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
                            <Banknote className="w-4 h-4" /> {salary}
                        </span>
                    </div>

                    {applied ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Đã nộp hồ sơ thành công
                        </div>
                    ) : (
                        <Button onClick={() => setShowModal(true)} className="px-6">
                            Nộp hồ sơ ngay
                        </Button>
                    )}
                </div>

                {/* Job detail card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                    <div>
                        <h2 className="font-semibold text-gray-900 mb-2">Mô tả công việc</h2>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>
                    {job.requirements && (
                        <div>
                            <h2 className="font-semibold text-gray-900 mb-2">Yêu cầu ứng viên</h2>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal nộp hồ sơ */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-bold text-lg">Nộp hồ sơ</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Vị trí: <span className="font-medium text-gray-800">{job.title}</span>
                        </p>

                        <form onSubmit={handleApply} className="space-y-4">
                            {/* Upload CV */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CV (PDF, tối đa 5MB) *
                                </label>
                                <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${cvFile ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="file" accept=".pdf" className="hidden" onChange={e => setCvFile(e.target.files[0])} />
                                    <Upload className={`w-5 h-5 ${cvFile ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className={`text-sm ${cvFile ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                                        {cvFile ? cvFile.name : 'Click để chọn file PDF'}
                                    </span>
                                </label>
                            </div>

                            {/* Cover letter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thư xin việc <span className="font-normal text-gray-400">(tuỳ chọn)</span>
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={e => setCoverLetter(e.target.value)}
                                    rows={4}
                                    placeholder="Kính gửi Quý công ty..."
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                                    Huỷ
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-2 flex-1">
                                    {submitting
                                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang nộp...</>
                                        : 'Nộp hồ sơ'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
