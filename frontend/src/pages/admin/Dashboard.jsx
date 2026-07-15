import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, FileText, TrendingUp, Trash2, Loader2, LogOut } from 'lucide-react'
import { adminStatsApi, adminUsersApi, adminDeleteUserApi } from '@/services/aiService'
import { useAuth } from '@/context/AuthContext'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const { logoutUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        Promise.all([adminStatsApi(), adminUsersApi()])
            .then(([s, u]) => { setStats(s.data); setUsers(u.data.data) })
            .finally(() => setLoading(false))
    }, [])

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Xóa tài khoản "${name}"?`)) return
        try {
            await adminDeleteUserApi(id)
            setUsers(prev => prev.filter(u => u.id !== id))
        } catch (e) {
            alert(e.response?.data?.message || 'Lỗi khi xóa')
        }
    }

    const roleColor = (role) => ({
        admin: 'bg-red-100 text-red-700',
        recruiter: 'bg-blue-100 text-blue-700',
        candidate: 'bg-green-100 text-green-700',
    })[role] || ''

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )

    const statCards = [
        { icon: Users, label: 'Tổng users', value: stats?.totalUsers, sub: `${stats?.totalCandidates} ứng viên · ${stats?.totalRecruiters} recruiter` },
        { icon: Briefcase, label: 'Tin tuyển dụng', value: stats?.totalJobs, sub: `${stats?.activeJobs} đang hoạt động` },
        { icon: FileText, label: 'Hồ sơ đã nộp', value: stats?.totalApplications, sub: `${stats?.hiredCount} đã tuyển` },
        { icon: TrendingUp, label: 'Tỷ lệ tuyển dụng', value: stats?.hiredRate, sub: 'hired / total applications' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-bold text-blue-600">RecruitAI — Admin</h1>
                <Button variant="ghost" onClick={handleLogout}
                    className="text-red-500 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                </Button>
            </header>

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map(({ icon: Icon, label, value, sub }) => (
                        <Card key={label}>
                            <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{label}</p>
                                        <p className="text-3xl font-bold mt-1">{value}</p>
                                        <p className="text-xs text-gray-400 mt-1">{sub}</p>
                                    </div>
                                    <Icon className="w-6 h-6 text-blue-600 mt-1" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bảng users */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách tài khoản ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th className="pb-3 pr-4">ID</th>
                                        <th className="pb-3 pr-4">Họ tên</th>
                                        <th className="pb-3 pr-4">Email</th>
                                        <th className="pb-3 pr-4">Vai trò</th>
                                        <th className="pb-3 pr-4">Ngày tạo</th>
                                        <th className="pb-3">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 pr-4 text-gray-400">#{u.id}</td>
                                            <td className="py-3 pr-4 font-medium">{u.full_name}</td>
                                            <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                                            <td className="py-3 pr-4">
                                                <Badge className={`text-xs ${roleColor(u.role)}`}>{u.role}</Badge>
                                            </td>
                                            <td className="py-3 pr-4 text-gray-500">
                                                {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="py-3">
                                                {u.role !== 'admin' && (
                                                    <Button variant="ghost" size="sm"
                                                        className="text-red-500 hover:bg-red-50"
                                                        onClick={() => handleDelete(u.id, u.full_name)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}