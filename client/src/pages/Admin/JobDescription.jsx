import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import { Paper, Box, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

/* ─── Google Fonts ─── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
document.head.appendChild(fontLink);

/* ─── Design tokens (Light Theme) ─── */
const t = {
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E9D5FF',
  borderHov: '#C084FC',
  text: '#111827',
  muted: '#6B7280',
  accent: '#6B46C1',
  accentDim: '#F3E8FF',
  green: '#15803D',
  greenDim: '#DCFCE7',
  red: '#DC2626',
  redDim: '#FEE2E2',
  amber: '#B45309',
  amberDim: '#FEF3C7',
};

const STATUS = {
  pending: { label: 'Pending', bg: t.amberDim, color: t.amber, dot: '#F59E0B' },
  reviewed: { label: 'Reviewed', bg: t.greenDim, color: t.green, dot: '#22C55E' },
  risky: { label: 'Risky', bg: t.redDim, color: t.red, dot: '#EF4444' },
};

/* ─── Inline global styles ─── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${t.bg}; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: ${t.surface}; }
    ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${t.borderHov}; }
    .jd-select { appearance: none; -webkit-appearance: none; cursor: pointer; outline: none; }
    .jd-select option { background: ${t.card}; color: ${t.text}; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes shimmer {
      0%  { background-position: -200% 0; }
      100%{ background-position:  200% 0; }
    }
    .shimmer-row {
      background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    .sort-th { cursor: pointer; user-select: none; }
    .sort-th:hover { background: #F3F0FF !important; color: ${t.accent} !important; }
    .sort-arrow { opacity: 0; transition: opacity 0.18s, transform 0.18s; }
    .sort-th:hover .sort-arrow { opacity: 0.5; }
    .sort-arrow.active { opacity: 1; }
  `}</style>
);

/* ─── Status Pill ─── */
const StatusPill = ({ value, onChange, compact }) => {
  const [open, setOpen] = useState(false);
  const s = STATUS[value] || STATUS.pending;
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: s.bg, color: s.color,
          border: `1px solid ${s.color}40`,
          borderRadius: 99, padding: compact ? '4px 10px' : '5px 14px',
          fontSize: compact ? 11 : 12, fontFamily: "'Inter', sans-serif",
          fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'all .2s',
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: s.dot, animation: value === 'pending' ? 'pulse-dot 1.5s infinite' : 'none',
          flexShrink: 0,
        }} />
        {s.label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill={s.color}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M1 3l4 4 4-4" stroke={s.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: .95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .95 }}
            transition={{ duration: .15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: 10, overflow: 'hidden', minWidth: 140,
              boxShadow: '0 12px 32px rgba(107, 70, 193, 0.1)',
            }}
          >
            {Object.entries(STATUS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '9px 14px',
                  background: key === value ? cfg.bg : 'transparent',
                  color: cfg.color, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  textAlign: 'left', transition: 'background .15s',
                }}
                onMouseEnter={e => { if (key !== value) e.currentTarget.style.background = '#F3F4F6'; }}
                onMouseLeave={e => { if (key !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
                {cfg.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay }}
        style={{ flex: 1, minWidth: 140 }}
    >
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                border: '1px solid #F1F5F9',
                bgcolor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.25s ease',
                '&:hover': { borderColor: color, boxShadow: `0 4px 16px ${color}18` },
            }}
        >
            <Box sx={{
                width: 44, height: 44, borderRadius: 2.5,
                bgcolor: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon sx={{ fontSize: 22, color }} />
            </Box>
            <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    </motion.div>
);

/* ─── Search Bar ─── */
const SearchBar = ({ value, onChange }) => (
  <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2"
      style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
    <input
      type="text"
      placeholder="Search by title or company…"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 10, padding: '10px 14px 10px 40px',
        color: t.text, fontSize: 13, fontFamily: "'Inter', sans-serif",
        outline: 'none', transition: 'border-color .2s, box-shadow .2s',
      }}
      onFocus={e => {
        e.target.style.borderColor = t.accent;
        e.target.style.boxShadow = `0 0 0 2px ${t.accent}20`;
      }}
      onBlur={e => {
        e.target.style.borderColor = t.border;
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

/* ─── Tab Bar ─── */
const TabBar = ({ active, onChange, counts }) => {
  const tabs = [
    { key: 'All', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'reviewed', label: 'Reviewed', count: counts.reviewed },
    { key: 'risky', label: 'Risky', count: counts.risky },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, background: t.card, borderRadius: 10, padding: 4, border: `1px solid ${t.border}` }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 7, border: 'none',
            background: active === tab.key ? t.accentDim : 'transparent',
            color: active === tab.key ? t.accent : t.muted,
            fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: active === tab.key ? 600 : 500,
            cursor: 'pointer', transition: 'all .2s',
          }}
          onMouseEnter={e => { if (active !== tab.key) e.currentTarget.style.color = t.text; }}
          onMouseLeave={e => { if (active !== tab.key) e.currentTarget.style.color = t.muted; }}
        >
          {tab.label}
          <span style={{
            background: active === tab.key ? t.accent : '#F3F4F6',
            color: active === tab.key ? '#FFFFFF' : t.muted,
            borderRadius: 99, padding: '2px 8px', fontSize: 11,
            fontFamily: "'Inter', sans-serif", fontWeight: 600
          }}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

/* ─── Skeleton Rows ─── */
const SkeletonRows = () => (
  <>
    {[1, 2, 3, 4, 5].map(i => (
      <tr key={i}>
        {[200, 140, 100, 90].map((w, j) => (
          <td key={j} style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
            <div className="shimmer-row" style={{ height: 14, borderRadius: 6, width: w, maxWidth: '100%' }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

/* ─── Sort Arrow Icon ─── */
const SortArrow = ({ direction, active }) => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`sort-arrow${active ? ' active' : ''}`}
    style={{
      marginLeft: 4, flexShrink: 0,
      transform: direction === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
      color: active ? t.accent : t.muted,
      transition: 'transform 0.2s, opacity 0.2s',
    }}
  >
    <path d="M12 5l0 14M5 12l7-7 7 7" />
  </svg>
);

/* ─── Pagination ─── */
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: 10, borderRadius: 12, border: 'none', background: 'transparent',
            color: '#6B7280', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.3 : 1, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (currentPage !== 1) { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </button>

        {/* Page Numbers */}
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              width: 40, height: 40, borderRadius: 12, border: 'none',
              fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.3s',
              background: currentPage === page ? '#111827' : 'transparent',
              color: currentPage === page ? '#FFFFFF' : '#6B7280',
              boxShadow: currentPage === page ? '0 10px 15px rgba(17,24,39,0.2)' : 'none',
            }}
            onMouseEnter={e => { if (currentPage !== page) { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; } }}
            onMouseLeave={e => { if (currentPage !== page) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; } }}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            padding: 10, borderRadius: 12, border: 'none', background: 'transparent',
            color: '#6B7280', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.3 : 1, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (currentPage !== totalPages) { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>
      </div>

      {/* Count info */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', fontFamily: "'Inter', sans-serif", marginTop: 16, marginBottom: 32 }}>
        Showing {start}–{end} of {totalItems} job{totalItems !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

/* ─── Job Table ─── */
const SORTABLE_COLS = [
  { key: 'jobTitle', label: 'Job Title' },
  { key: 'companyName', label: 'Company' },
  { key: 'date', label: 'Date Posted' },
  { key: null, label: 'Status' },
];

const JobTable = ({ jobs, onStatusChange, loading, sortKey, sortDir, onSort }) => {
  return (
    <div style={{
      background: t.card, border: `1px solid ${t.border}`,
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(107, 70, 193, 0.05)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}` }}>
              {SORTABLE_COLS.map(col => (
                <th
                  key={col.label}
                  className={col.key ? 'sort-th' : ''}
                  onClick={() => col.key && onSort(col.key)}
                  style={{
                    padding: '16px 20px', textAlign: 'left',
                    fontSize: 12, fontFamily: "'Inter', sans-serif",
                    color: sortKey === col.key ? t.accent : t.muted,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    fontWeight: 600, background: '#F9FAFB', whiteSpace: 'nowrap',
                    transition: 'color .15s, background .15s',
                    cursor: col.key ? 'pointer' : 'default',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {col.label}
                    {col.key && (
                      <SortArrow
                        direction={sortKey === col.key ? sortDir : 'asc'}
                        active={sortKey === col.key}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <SkeletonRows /> : (
              <>
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '60px 20px', textAlign: 'center', color: t.muted, fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
                      No jobs match the current filters.
                    </td>
                  </tr>
                )}
                <AnimatePresence>
                  {jobs.map((job, i) => (
                    <motion.tr
                      key={job._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: .25, delay: i * 0.03 }}
                      style={{
                        borderBottom: `1px solid ${t.border}`,
                        transition: 'background .15s',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: t.text, fontWeight: 600 }}>
                          {job.jobTitle}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: t.muted, fontWeight: 500 }}>
                          {job.companyName}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: t.muted, fontWeight: 500 }}>
                          {job.date}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <StatusPill
                          value={job.adminReview}
                          onChange={(val) => onStatusChange(job._id, val)}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Mobile Card ─── */
const MobileCard = ({ job, onStatusChange, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: .3, delay: index * 0.06 }}
    style={{
      background: t.card, border: `1px solid ${t.border}`,
      borderRadius: 14, padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: '0 4px 12px rgba(107, 70, 193, 0.05)',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: t.text, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>
        {job.jobTitle}
      </span>
      <StatusPill value={job.adminReview} onChange={val => onStatusChange(job._id, val)} compact />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: t.muted, fontWeight: 500 }}>
        {job.companyName}
      </span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: t.muted, fontWeight: 500 }}>
        {job.date}
      </span>
    </div>
  </motion.div>
);

/* ─── Main Component ─── */
const JOBS_PER_PAGE = 8;

const JobDescriptions = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Sorting state
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/jobs');
      const raw = res.data?.data || res.data || [];
      setJobsData(raw.map(job => ({
        ...job,
        date: job.createdAt
          ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : new Date(parseInt(job._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        _dateRaw: job.createdAt
          ? new Date(job.createdAt).getTime()
          : new Date(parseInt(job._id.substring(0, 8), 16) * 1000).getTime(),
      })));
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.patch(`/jobs/${jobId}/admin-review`, { adminReview: newStatus });
      setJobsData(prev => prev.map(j => j._id === jobId ? { ...j, adminReview: newStatus } : j));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const counts = {
    all: jobsData.length,
    pending: jobsData.filter(j => j.adminReview === 'pending').length,
    reviewed: jobsData.filter(j => j.adminReview === 'reviewed').length,
    risky: jobsData.filter(j => j.adminReview === 'risky').length,
  };

  // Filter
  const filteredJobs = jobsData.filter(job => {
    const matchTab = activeTab === 'All' || job.adminReview === activeTab;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || `${job.jobTitle} ${job.companyName}`.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  // Sort
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aVal = a[sortKey] ?? '';
    let bVal = b[sortKey] ?? '';
    if (sortKey === 'date') { aVal = a._dateRaw; bVal = b._dateRaw; }
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  // Reset page when filter/search/sort changes
  const handleTabChange = (tab) => { setActiveTab(tab); setCurrentPage(1); };
  const handleSearch = (q) => { setSearchQuery(q); setCurrentPage(1); };

  return (
    <>
      <GlobalStyle />
      <ToastContainer
        theme="light"
        toastStyle={{ background: t.card, border: `1px solid ${t.border}`, fontFamily: "'Inter', sans-serif" }}
      />
      <div style={{
        minHeight: '100vh', background: t.bg,
        fontFamily: "'Inter', sans-serif",
        padding: isMobile ? '24px 16px' : '40px 32px',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${t.accent}, #A78BFA)`, borderRadius: 4 }} />
                <h1 style={{
                  fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 22 : 28,
                  fontWeight: 800, color: t.text, letterSpacing: '-0.02em',
                }}>
                  Job Board
                </h1>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: t.muted, marginLeft: 14 }}>
                Moderate and review submitted job descriptions
              </p>
            </div>

            <button
              onClick={fetchJobs}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: t.card, border: `1px solid ${t.border}`,
                color: t.accent, borderRadius: 9, padding: '8px 16px',
                fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                cursor: 'pointer', transition: 'all .2s',
                boxShadow: '0 2px 4px rgba(107, 70, 193, 0.05)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = t.accentDim; }}
              onMouseLeave={e => { e.currentTarget.style.background = t.card; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              Refresh
            </button>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatCard label="Total" value={counts.all} color={t.accent} icon={AssignmentIcon} delay={.1} />
            <StatCard label="Pending" value={counts.pending} color={t.amber} icon={PendingActionsIcon} delay={.15} />
            <StatCard label="Reviewed" value={counts.reviewed} color={t.green} icon={CheckCircleOutlineIcon} delay={.2} />
            <StatCard label="Risky" value={counts.risky} color={t.red} icon={ReportProblemIcon} delay={.25} />
          </div>

          {/* ── Controls ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3, duration: .4 }}
            style={{
              display: 'flex', gap: 12, flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <SearchBar value={searchQuery} onChange={handleSearch} />
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <TabBar active={activeTab} onChange={handleTabChange} counts={counts} />
            </div>
          </motion.div>

          {/* ── Table / Cards ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .4 }}>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {loading
                  ? [1, 2, 3].map(i => (
                    <div key={i} className="shimmer-row" style={{ height: 100, borderRadius: 14 }} />
                  ))
                  : paginatedJobs.length === 0
                    ? (
                      <div style={{
                        background: t.card, border: `1px solid ${t.border}`,
                        borderRadius: 14, padding: '48px 20px',
                        textAlign: 'center', color: t.muted, fontSize: 14,
                        fontFamily: "'Inter', sans-serif"
                      }}>
                        No jobs match the current filters.
                      </div>
                    )
                    : paginatedJobs.map((job, i) => (
                      <MobileCard key={job._id} job={job} onStatusChange={handleStatusChange} index={i} />
                    ))
                }
              </div>
            ) : (
              <JobTable
                jobs={paginatedJobs}
                onStatusChange={handleStatusChange}
                loading={loading}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            )}

            {/* ── Pagination ── */}
            {!loading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={sortedJobs.length}
                itemsPerPage={JOBS_PER_PAGE}
              />
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default JobDescriptions;