import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Bot, FileText, HelpCircle, MessageSquare,
    Loader2, Send, Copy, Check, Sparkles, Star
} from 'lucide-react'
import { scoreCVApi, generateJDApi, interviewQuestionsApi, chatApi } from '@/services/aiService'
import { jobService, applicationService } from '@/services/jobService'

// ── Utility: nút Copy ─────────────────────────────────────────
function CopyButton({ text, className = '' }) {
    const [copied, setCopied] = useState(false)
    const handle = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <Button variant="outline" size="sm" onClick={handle} className={className}>
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Đã copy' : 'Copy'}
        </Button>
    )
}

// ── Tab 1: Chấm điểm CV ──────────────────────────────────────
function ScoreTab() {
    const [jobs, setJobs] = useState([])
    const [selectedJob, setSelectedJob] = useState('')
    const [apps, setApps] = useState([])
    const [selectedApp, setSelectedApp] = useState('')
    const [loadingJobs, setLoadingJobs] = useState(true)
    const [loadingApps, setLoadingApps] = useState(false)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Load danh sách job khi mount
    useEffect(() => {
        jobService.getAll({ limit: 100 })
            .then(res => setJobs(res.data.data || []))
            .catch(() => setJobs([]))
            .finally(() => setLoadingJobs(false))
    }, [])

    // Load danh sách đơn khi chọn job
    const handleJobChange = async (jobId) => {
        setSelectedJob(jobId)
        setSelectedApp('')
        setResult(null)
        setApps([])
        if (!jobId) return
        setLoadingApps(true)
        try {
            const res = await applicationService.getByJob(jobId)
            setApps(res.data.data || [])
        } catch {
            setApps([])
        } finally {
            setLoadingApps(false)
        }
    }

    const handleScore = async () => {
        if (!selectedApp) return setError('Vui lòng chọn ứng viên')
        setLoading(true); setError(''); setResult(null)
        try {
            const { data } = await scoreCVApi(Number(selectedApp))
            setResult(data)
        } catch (e) {
            setError(e.response?.data?.message || 'Lỗi kết nối AI, thử lại sau')
        } finally {
            setLoading(false)
        }
    }

    const scoreColor = (s) => {
        if (s >= 75) return { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Phù hợp tốt' }
        if (s >= 50) return { bar: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: 'Cần xem xét' }
        return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Không phù hợp' }
    }

    return (
        <div className="space-y-5">
            <div className="space-y-3">
                <p className="text-sm text-gray-500">Chọn tin tuyển dụng và ứng viên để AI phân tích CV và cho điểm tự động.</p>

                {/* Bước 1: chọn job */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Bước 1 — Chọn tin tuyển dụng</label>
                    <select
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedJob}
                        onChange={e => handleJobChange(e.target.value)}
                        disabled={loadingJobs}
                    >
                        <option value="">{loadingJobs ? 'Đang tải...' : '-- Chọn tin tuyển dụng --'}</option>
                        {jobs.map(j => (
                            <option key={j.id} value={j.id}>{j.title} ({j.location})</option>
                        ))}
                    </select>
                </div>

                {/* Bước 2: chọn ứng viên */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Bước 2 — Chọn ứng viên</label>
                    <select
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        value={selectedApp}
                        onChange={e => { setSelectedApp(e.target.value); setResult(null); setError('') }}
                        disabled={!selectedJob || loadingApps}
                    >
                        <option value="">
                            {!selectedJob ? '-- Chọn tin trước --'
                                : loadingApps ? 'Đang tải...'
                                    : apps.length === 0 ? 'Chưa có đơn nào'
                                        : '-- Chọn ứng viên --'}
                        </option>
                        {apps.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.candidate_name} — {a.candidate_email}
                                {a.ai_score !== null ? ` (đã chấm: ${a.ai_score}đ)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <Button onClick={handleScore} disabled={loading || !selectedApp}>
                    {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang phân tích...</>
                        : <><Sparkles className="w-4 h-4 mr-2" />Chấm điểm CV</>
                    }
                </Button>

                {error && <p className="text-sm text-red-500">⚠️ {error}</p>}
            </div>

            {loading && (
                <Card className="border-dashed">
                    <CardContent className="pt-6 space-y-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
                    </CardContent>
                </Card>
            )}

            {result && (() => {
                const color = scoreColor(result.score)
                return (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Kết quả phân tích</CardTitle>
                                <Badge className={`${color.bg} ${color.text} border text-xs font-medium`}>
                                    {color.label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Score bar */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-gray-500">Điểm phù hợp</span>
                                    <span className={`text-3xl font-bold ${color.text}`}>{result.score}<span className="text-base text-gray-400 font-normal">/100</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-700 ${color.bar}`}
                                        style={{ width: `${result.score}%` }}
                                    />
                                </div>
                            </div>

                            {/* Strengths / Weaknesses */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Điểm mạnh
                                    </p>
                                    <ul className="space-y-1.5">
                                        {result.strengths?.map((s, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                <span className="text-green-400 mt-0.5">•</span>{s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                                        ⚠️ Điểm cần cải thiện
                                    </p>
                                    <ul className="space-y-1.5">
                                        {result.weaknesses?.map((w, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                <span className="text-red-400 mt-0.5">•</span>{w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Đề xuất của AI</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation}</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })()}
        </div>
    )
}

// ── Tab 2: Sinh mô tả công việc ───────────────────────────────
function GenerateJDTab() {
    const [form, setForm] = useState({ title: '', level: 'Middle', requirements: '', salary_range: '' })
    const [jd, setJd] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!form.title || !form.requirements) return setError('Vui lòng nhập chức danh và kỹ năng yêu cầu')
        setLoading(true); setJd(''); setError('')
        try {
            const { data } = await generateJDApi(form)
            setJd(data.jd)
        } catch (e) {
            setError(e.response?.data?.message || 'Lỗi kết nối AI, thử lại sau')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-5">
            <p className="text-sm text-gray-500">
                Điền thông tin vị trí, AI sẽ tự sinh mô tả công việc chuyên nghiệp bằng tiếng Việt.
            </p>

            <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Chức danh *</label>
                    <Input
                        placeholder="VD: Frontend Developer"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Cấp độ</label>
                    <select
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.level}
                        onChange={e => setForm({ ...form, level: e.target.value })}
                    >
                        {['Junior', 'Middle', 'Senior', 'Lead', 'Manager'].map(l => (
                            <option key={l}>{l}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Kỹ năng yêu cầu *</label>
                    <Input
                        placeholder="VD: React, TypeScript, 2 năm kinh nghiệm"
                        value={form.requirements}
                        onChange={e => setForm({ ...form, requirements: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Mức lương</label>
                    <Input
                        placeholder="VD: 15–25 triệu"
                        value={form.salary_range}
                        onChange={e => setForm({ ...form, salary_range: e.target.value })}
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-500">⚠️ {error}</p>}

            <Button onClick={handleGenerate} disabled={loading || !form.title}>
                {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang sinh mô tả...</>
                    : <><Sparkles className="w-4 h-4 mr-2" />Sinh mô tả công việc</>
                }
            </Button>

            {jd && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">Mô tả công việc</p>
                        <CopyButton text={jd} />
                    </div>
                    <Textarea
                        value={jd}
                        readOnly
                        rows={14}
                        className="text-sm bg-gray-50 resize-none leading-relaxed"
                    />
                </div>
            )}
        </div>
    )
}

// ── Tab 3: Câu hỏi phỏng vấn ──────────────────────────────────
function InterviewQTab() {
    const [form, setForm] = useState({ job_title: '', level: 'Middle', focus: '' })
    const [questions, setQ] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!form.job_title) return setError('Vui lòng nhập vị trí công việc')
        setLoading(true); setQ([]); setError('')
        try {
            const payload = { ...form, focus: form.focus.split(',').map(s => s.trim()).filter(Boolean) }
            const { data } = await interviewQuestionsApi(payload)
            setQ(data.questions || [])
        } catch (e) {
            setError(e.response?.data?.message || 'Lỗi kết nối AI, thử lại sau')
        } finally {
            setLoading(false)
        }
    }

    const categoryStyle = (cat) => ({
        'Kỹ thuật': 'bg-blue-100 text-blue-700 border-blue-200',
        'Tình huống': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Hành vi': 'bg-purple-100 text-purple-700 border-purple-200',
        'Văn hóa': 'bg-green-100 text-green-700 border-green-200',
    })[cat] || 'bg-gray-100 text-gray-700 border-gray-200'

    return (
        <div className="space-y-5">
            <p className="text-sm text-gray-500">
                AI sẽ gợi ý 10 câu hỏi phỏng vấn phù hợp theo vị trí và cấp độ.
            </p>

            <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Vị trí *</label>
                    <Input
                        placeholder="VD: Backend Developer"
                        value={form.job_title}
                        onChange={e => setForm({ ...form, job_title: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Cấp độ</label>
                    <select
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.level}
                        onChange={e => setForm({ ...form, level: e.target.value })}
                    >
                        {['Junior', 'Middle', 'Senior', 'Lead'].map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Trọng tâm kỹ thuật</label>
                    <Input
                        placeholder="VD: Node.js, SQL (tuỳ chọn)"
                        value={form.focus}
                        onChange={e => setForm({ ...form, focus: e.target.value })}
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-500">⚠️ {error}</p>}

            <Button onClick={handleGenerate} disabled={loading || !form.job_title}>
                {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang tạo câu hỏi...</>
                    : <><HelpCircle className="w-4 h-4 mr-2" />Gợi ý câu hỏi</>
                }
            </Button>

            {loading && (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            )}

            {questions.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">{questions.length} câu hỏi gợi ý</p>
                        <CopyButton text={questions.map((q, i) => `${i + 1}. [${q.category}] ${q.question}`).join('\n')} />
                    </div>
                    {questions.map((q, i) => (
                        <div key={i} className="flex gap-3 p-3.5 border rounded-lg hover:bg-gray-50 transition-colors group">
                            <span className="text-gray-300 font-mono text-sm w-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                            <div className="flex-1 min-w-0">
                                <Badge className={`text-xs mb-1.5 border ${categoryStyle(q.category)}`}>
                                    {q.category}
                                </Badge>
                                <p className="text-sm text-gray-700 leading-relaxed">{q.question}</p>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(q.question)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
                                title="Copy câu hỏi"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Tab 4: Chatbot ─────────────────────────────────────────────
function ChatTab() {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Xin chào! Tôi là trợ lý AI tuyển dụng. Hỏi tôi bất cứ điều gì về quy trình tuyển dụng, đánh giá ứng viên, hay viết JD nhé.' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    // Auto-scroll xuống tin nhắn mới nhất
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const handleSend = async () => {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setLoading(true)
        try {
            const { data } = await chatApi(userMsg)
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Lỗi kết nối AI. Vui lòng thử lại sau.' }])
        } finally {
            setLoading(false)
        }
    }

    const suggestions = ['Cách viết JD thu hút ứng viên?', 'Quy trình phỏng vấn tốt nhất?', 'Làm sao đánh giá soft skills?']

    return (
        <div className="flex flex-col h-[520px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-1 mb-3 space-y-3 pr-2">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'ai' && (
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-2.5 justify-start">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Quick suggestions — chỉ hiện khi mới bắt đầu */}
            {messages.length === 1 && (
                <div className="flex gap-2 flex-wrap mb-3">
                    {suggestions.map(s => (
                        <button
                            key={s}
                            onClick={() => setInput(s)}
                            className="text-xs px-3 py-1.5 border rounded-full text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
                <Input
                    placeholder="Nhập câu hỏi về tuyển dụng..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={loading}
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="shrink-0">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

// ── Component chính ────────────────────────────────────────────
export default function AITools() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Breadcrumb / nút quay lại */}
                <button
                    onClick={() => navigate('/recruiter')}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại Quản lý tin
                </button>

                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            AI Tuyển dụng
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Bộ công cụ AI hỗ trợ toàn bộ quy trình tuyển dụng</p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs shrink-0">
                        <Sparkles className="w-3 h-3 mr-1" /> Gemini AI
                    </Badge>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="score">
                    {/* TabsList dùng flex thay grid để tránh chồng chữ */}
                    <TabsList className="flex w-full mb-5 h-auto p-1 gap-1">
                        <TabsTrigger value="score" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm whitespace-nowrap">
                            <Star className="w-3.5 h-3.5 shrink-0" />
                            Chấm CV
                        </TabsTrigger>
                        <TabsTrigger value="jd" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm whitespace-nowrap">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            Sinh JD
                        </TabsTrigger>
                        <TabsTrigger value="questions" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm whitespace-nowrap">
                            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                            Câu hỏi PV
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm whitespace-nowrap">
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            Chat AI
                        </TabsTrigger>
                    </TabsList>

                    <Card>
                        <CardContent className="pt-6">
                            <TabsContent value="score" className="mt-0">
                                <ScoreTab />
                            </TabsContent>
                            <TabsContent value="jd" className="mt-0">
                                <GenerateJDTab />
                            </TabsContent>
                            <TabsContent value="questions" className="mt-0">
                                <InterviewQTab />
                            </TabsContent>
                            <TabsContent value="chat" className="mt-0">
                                <ChatTab />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    )
}
