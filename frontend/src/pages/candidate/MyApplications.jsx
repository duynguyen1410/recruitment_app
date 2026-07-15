import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowRight, Loader2, Briefcase } from 'lucide-react'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { applicationService } from '@/services/jobService'

export default function MyApplications() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        applicationService.getMy()
            .then(({ data }) => setApps(data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Đơn của tôi</h1>
                    <p className="text-gray-500 mt-1 text-sm">Theo dõi trạng thái tất cả đơn bạn đã nộp</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : apps.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-500 mb-1">Bạn chưa nộp hồ sơ nào</p>
                        <p className="text-sm text-gray-400 mb-5">Tìm và ứng tuyển vị trí phù hợp với bạn</p>
                        <Link to="/candidate">
                            <Button className="gap-2">
                                <Briefcase className="w-4 h-4" /> Tìm việc ngay
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {apps.map(app => (
                            <div
                                key={app.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap"
                            >
                                {/* Job info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate mb-0.5">{app.job_title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {app.recruiter_name}
                                        {app.location ? ` · ${app.location}` : ''}
                                    </p>
                                </div>

                                {/* Right side */}
                                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                                    {app.ai_score !== null && app.ai_score !== undefined && (
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                            AI: {app.ai_score}/100
                                        </span>
                                    )}
                                    <StatusBadge status={app.status} />
                                    <span className="text-xs text-gray-400">
                                        {new Date(app.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
