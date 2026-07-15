import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Search, X, Briefcase, Banknote, ArrowRight, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { jobService } from '@/services/jobService'

function formatSalary(min, max) {
    if (!min || !max) return 'Thoả thuận'
    const fmt = n => (n / 1_000_000).toFixed(0) + ' tr'
    return `${fmt(min)} – ${fmt(max)}`
}

export default function JobList() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [location, setLocation] = useState('')

    useEffect(() => { fetchJobs() }, [])

    const fetchJobs = async (q = '', loc = '') => {
        setLoading(true)
        try {
            const params = {}
            if (q) params.search = q
            if (loc) params.location = loc
            const { data } = await jobService.getAll(params)
            setJobs(data.data || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => fetchJobs(search, location)
    const handleClear = () => { setSearch(''); setLocation(''); fetchJobs() }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Việc làm đang tuyển dụng</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {loading ? 'Đang tải...' : `${jobs.length} vị trí phù hợp`}
                    </p>
                </div>

                {/* Search bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            className="pl-9"
                            placeholder="Tìm kiếm vị trí..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="relative sm:w-44">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            className="pl-9"
                            placeholder="Địa điểm..."
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} className="shrink-0">Tìm kiếm</Button>
                    {(search || location) && (
                        <Button variant="outline" onClick={handleClear} className="shrink-0">
                            <X className="w-4 h-4 mr-1" /> Xóa lọc
                        </Button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-500">Không tìm thấy vị trí phù hợp</p>
                        {(search || location) && (
                            <Button variant="ghost" onClick={handleClear} className="mt-3 text-blue-600">
                                Xóa bộ lọc để xem tất cả
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {jobs.map(job => (
                            <Link
                                key={job.id}
                                to={`/candidate/jobs/${job.id}`}
                                className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">{job.recruiter_name}</p>
                                        <div className="flex flex-wrap gap-3">
                                            {job.location && (
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                                <Banknote className="w-3.5 h-3.5" />
                                                {formatSalary(job.salary_min, job.salary_max)}
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
