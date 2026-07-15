const STATUS_CONFIG = {
    applied: { label: 'Đã nộp', bg: '#F1F5F9', color: '#64748B' },
    screening: { label: 'Đang xem xét', bg: '#FFFBEB', color: '#D97706' },
    interview: { label: 'Phỏng vấn', bg: '#EFF6FF', color: '#2563EB' },
    offer: { label: 'Offer', bg: '#F5F3FF', color: '#7C3AED' },
    hired: { label: 'Đã nhận', bg: '#ECFDF5', color: '#059669' },
    rejected: { label: 'Không phù hợp', bg: '#FEF2F2', color: '#DC2626' },
}

export default function StatusBadge({ status, size = 'md' }) {
    const cfg = STATUS_CONFIG[status] || { label: status, bg: '#F1F5F9', color: '#64748B' }
    const pad = size === 'sm' ? '2px 8px' : '3px 10px'
    const fs = size === 'sm' ? '11px' : '12px'
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: pad, borderRadius: 999,
            background: cfg.bg, color: cfg.color,
            fontSize: fs, fontWeight: 600,
            whiteSpace: 'nowrap',
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, marginRight: 5, flexShrink: 0 }} />
            {cfg.label}
        </span>
    )
}
