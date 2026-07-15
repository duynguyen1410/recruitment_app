import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Menu, LogOut, User, Briefcase, Bot, BarChart2, ChevronDown } from 'lucide-react'

// Cấu hình menu theo role
const MENUS = {
    candidate: [
        { to: '/candidate', label: 'Việc làm', icon: Briefcase },
        { to: '/candidate/my-apps', label: 'Đơn của tôi', icon: User },
    ],
    recruiter: [
        { to: '/recruiter', label: 'Quản lý tin', icon: Briefcase },
        { to: '/recruiter/ai-tools', label: 'AI Tools', icon: Bot },
    ],
    admin: [
        { to: '/admin', label: 'Dashboard', icon: BarChart2 },
    ],
}

export default function Navbar() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const initials = user?.full_name
        ?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'U'

    const links = MENUS[user?.role] || []

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="font-bold text-xl text-blue-600 tracking-tight">
                    RecruitAI
                </Link>

                {/* Desktop links */}
                <nav className="hidden md:flex items-center gap-1">
                    {links.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to} to={to}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-gray-600
                         hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Icon className="w-4 h-4" /> {label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop: user dropdown */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="hidden lg:block">
                                <p className="text-sm font-medium">{user.full_name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Đăng xuất
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Đăng nhập</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Bắt đầu</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <div className="flex flex-col h-full">
                            {user && (
                                <div className="flex items-center gap-3 p-4 border-b mb-4">
                                    <Avatar>
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{user.full_name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                            )}
                            <nav className="flex-1 space-y-1 px-2">
                                {links.map(({ to, label, icon: Icon }) => (
                                    <Link key={to} to={to} onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                               hover:bg-gray-100 transition-colors">
                                        <Icon className="w-4 h-4 text-gray-500" /> {label}
                                    </Link>
                                ))}
                            </nav>
                            {user && (
                                <div className="p-4 border-t">
                                    <Button variant="ghost" className="w-full text-red-500 justify-start gap-2"
                                        onClick={() => {
                                            logoutUser()
                                            setOpen(false)
                                            navigate('/login', { replace: true })
                                        }}>
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

            </div>
        </header>
    )
}