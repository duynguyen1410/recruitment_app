import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import JobList from './pages/candidate/JobList'
import JobDetail from './pages/candidate/JobDetail'
import MyApplications from './pages/candidate/MyApplications'
import ManageJobs from './pages/recruiter/ManageJobs'
import ApplicationList from './pages/recruiter/ApplicationList'
import AITools from './pages/recruiter/AITools'
import AdminDashboard from './pages/admin/Dashboard'

const ComingSoon = ({ title, sprint }) => (
  <div style={{ minHeight: '100vh', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', maxWidth: 380 }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-primary)', marginBottom: '0.75rem' }}>{sprint}</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--c-text)', marginBottom: '0.75rem' }}>{title}</h1>
      <p style={{ color: 'var(--c-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Trang này sẽ được xây dựng ở Sprint tiếp theo.</p>
      <a href="/" style={{ color: 'var(--c-primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>← Về trang chủ</a>
    </div>
  </div>
)

const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)' }}>
    <div style={{ width: 24, height: 24, border: '2px solid var(--c-border)', borderTopColor: 'var(--c-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const map = { candidate: '/candidate', recruiter: '/recruiter', admin: '/admin' }
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to={map[user.role] || '/'} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Candidate  Sprint 3 */}
          <Route path="/candidate" element={<ProtectedRoute roles={['candidate']}><JobList /></ProtectedRoute>} />
          <Route path="/candidate/jobs/:id" element={<ProtectedRoute roles={['candidate']}><JobDetail /></ProtectedRoute>} />
          <Route path="/candidate/my-apps" element={<ProtectedRoute roles={['candidate']}><MyApplications /></ProtectedRoute>} />

          {/* Recruiter  Sprint 3 */}
          <Route path="/recruiter" element={<ProtectedRoute roles={['recruiter']}><ManageJobs /></ProtectedRoute>} />
          <Route path="/recruiter/apps/:jobId" element={<ProtectedRoute roles={['recruiter']}><ApplicationList /></ProtectedRoute>} />
          <Route path="/recruiter/ai-tools" element={<ProtectedRoute roles={['recruiter']}><AITools /></ProtectedRoute>} />

          {/* Admin Sprint 4 */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'var(--c-border)', lineHeight: 1 }}>404</p>
                <p style={{ color: 'var(--c-text-muted)', marginTop: '0.5rem' }}>Trang không tồn tại</p>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
