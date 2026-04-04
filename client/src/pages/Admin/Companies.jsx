import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "react-toastify";
import api from '../../api/api';
import { Paper, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/* ─── Google Fonts ─── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
document.head.appendChild(fontLink);

/* ─── Design tokens ─── */
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

/* ─── Global Styles ─── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${t.bg}; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: ${t.surface}; }
    ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${t.borderHov}; }
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

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="flex-1 min-w-[140px]"
  >
    <div
      className="p-5 rounded-2xl border bg-white flex items-center gap-4 transition-all duration-300 h-full"
      style={{
        borderColor: "#F1F5F9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 4px 16px ${color}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#F1F5F9";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon sx={{ fontSize: 22, color }} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-black text-black mt-0.5 leading-none">
          {value}
        </p>
      </div>
    </div>
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
      placeholder="Search by company name…"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 10, padding: '10px 14px 10px 40px',
        color: t.text, fontSize: 13, fontFamily: "'Inter', sans-serif",
        outline: 'none', transition: 'border-color .2s, box-shadow .2s',
      }}
      onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 2px ${t.accent}20`; }}
      onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

/* ─── Mini Status Badge ─── */
const StatusBadge = ({ count, label, bg, color }) => (
  count > 0 ? (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: bg, color, border: `1px solid ${color}30`,
      borderRadius: 99, padding: '2px 8px',
      fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 600,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {count} {label}
    </span>
  ) : null
);

/* ─── Sort Arrow ─── */
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

/* ─── Skeleton Rows ─── */
const SkeletonRows = () => (
  <>
    {[1, 2, 3, 4, 5].map(i => (
      <tr key={i}>
        {[180, 80, 160, 80].map((w, j) => (
          <td key={j} style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
            <div className="shimmer-row" style={{ height: 14, borderRadius: 6, width: w, maxWidth: '100%' }} />
          </td>
        ))}
      </tr>
    ))}
  </>
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
        Showing {start}–{end} of {totalItems} compan{totalItems !== 1 ? 'ies' : 'y'}
      </p>
    </div>
  );
};

/* ─── Company Table ─── */
const SORTABLE_COLS = [
  { key: 'companyName', label: 'Company' },
  { key: 'totalJobs', label: 'Jobs Posted' },
  { key: 'statusBreakdown', label: 'Status Breakdown' },
  { key: 'lastPosted', label: 'Last Posted' },
];

const CompanyTable = ({ companies, loading, sortKey, sortDir, onSort }) => (
  <div style={{
    background: t.card, border: `1px solid ${t.border}`,
    borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(107, 70, 193, 0.05)',
  }}>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${t.border}` }}>
            {SORTABLE_COLS.map(col => (
              <th
                key={col.label}
                className={col.key !== 'statusBreakdown' ? 'sort-th' : ''}
                onClick={() => col.key !== 'statusBreakdown' && onSort(col.key)}
                style={{
                  padding: '16px 20px', textAlign: 'left',
                  fontSize: 12, fontFamily: "'Inter', sans-serif",
                  color: sortKey === col.key ? t.accent : t.muted,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  fontWeight: 600, background: '#F9FAFB', whiteSpace: 'nowrap',
                  transition: 'color .15s, background .15s',
                  cursor: col.key !== 'statusBreakdown' ? 'pointer' : 'default',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {col.label}
                  {col.key !== 'statusBreakdown' && (
                    <SortArrow direction={sortKey === col.key ? sortDir : 'asc'} active={sortKey === col.key} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? <SkeletonRows /> : (
            <>
              {companies.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '60px 20px', textAlign: 'center', color: t.muted, fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
                    No companies match the current search.
                  </td>
                </tr>
              )}
              <AnimatePresence>
                {companies.map((co, i) => (
                  <motion.tr
                    key={co.companyName}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: .22, delay: i * 0.025 }}
                    style={{ borderBottom: `1px solid ${t.border}`, transition: 'background .15s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Company Name */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `${t.accent}14`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: t.accent, fontFamily: "'Inter', sans-serif" }}>
                            {co.companyName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: t.text, fontWeight: 600 }}>
                          {co.companyName}
                        </span>
                      </div>
                    </td>

                    {/* Jobs Posted */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: `${t.accent}10`, color: t.accent,
                        border: `1px solid ${t.accent}25`,
                        borderRadius: 99, padding: '4px 12px',
                        fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700,
                      }}>
                        {co.totalJobs}
                      </span>
                    </td>

                    {/* Status Breakdown */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        <StatusBadge count={co.verified} label="Verified" bg={t.greenDim} color={t.green} />
                        <StatusBadge count={co.pending} label="Pending" bg={t.amberDim} color={t.amber} />
                        <StatusBadge count={co.risky} label="Risky" bg={t.redDim} color={t.red} />
                      </div>
                    </td>

                    {/* Last Posted */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: t.muted, fontWeight: 500 }}>
                        {co.lastPostedLabel}
                      </span>
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

/* ─── Company Card (Grid View) ─── */



const CompanyCard = ({ co, index }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 relative"
    >
      {/* Jobs Badge */}
      <div className="absolute top-4 right-4 bg-purple-50 text-purple-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-purple-100/50 shadow-sm">
        {co.totalJobs} Jobs
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors overflow-hidden">
            {co.logo && !imgError ? (
              <img
                src={co.logo}
                alt={co.companyName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-2xl font-black text-purple-600">
                {co.companyName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 pr-12">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
              {co.companyName}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Active since: {co.lastPostedLabel}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {co.verified > 0 && <StatusBadge count={co.verified} label="Verified" bg={t.greenDim} color={t.green} />}
            {co.pending > 0 && <StatusBadge count={co.pending} label="Pending" bg={t.amberDim} color={t.amber} />}
            {co.risky > 0 && <StatusBadge count={co.risky} label="Risky" bg={t.redDim} color={t.red} />}
            {co.verified === 0 && co.pending === 0 && co.risky === 0 && (
              <span style={{
                fontSize: 11, color: t.muted,
                fontFamily: "'Inter', sans-serif", fontWeight: 500,
              }}>No status data</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ─── Main Component ─── */
const COMPANIES_PER_PAGE = 8;

const Companies = () => {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('totalJobs');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [viewMode, setViewMode] = useState('grid'); // 'table' or 'grid'


  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/jobs');
      const raw = res.data?.data || res.data || [];
      setJobsData(raw);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Aggregate jobs → companies ─── */
  const companiesMap = {};
  jobsData.forEach(job => {
    const name = job.companyName || 'Unknown';
    if (!companiesMap[name]) {
      companiesMap[name] = {
        companyName: name,
        totalJobs: 0,
        pending: 0,
        verified: 0,
        risky: 0,
        lastPosted: 0,
        logo: job.img || job.logo || null // Capture logo from job record
      };
    }
    const c = companiesMap[name];

    // Update logo if current is null but job has one
    if (!c.logo && (job.img || job.logo)) {
      c.logo = job.img || job.logo;
    }

    c.totalJobs += 1;
    const status = job.status || 'pending';
    if (status === 'verified') c.verified += 1;
    else if (status === 'risky') c.risky += 1;
    else c.pending += 1;

    const ts = job.createdAt
      ? new Date(job.createdAt).getTime()
      : new Date(parseInt(job._id?.substring(0, 8), 16) * 1000).getTime();
    if (ts > c.lastPosted) c.lastPosted = ts;
  });

  const allCompanies = Object.values(companiesMap).map(c => ({
    ...c,
    lastPostedLabel: c.lastPosted
      ? new Date(c.lastPosted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
  }));

  /* ─── Stats ─── */
  const totalJobs = jobsData.length;
  const totalVerified = jobsData.filter(j => j.status === 'verified').length;
  const totalRisky = jobsData.filter(j => j.status === 'risky').length;

  /* ─── Filter ─── */
  const filtered = allCompanies.filter(co =>
    !searchQuery || co.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─── Sort ─── */
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortKey] ?? '';
    let bVal = b[sortKey] ?? '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  /* ─── Paginate ─── */
  const totalPages = Math.ceil(sorted.length / COMPANIES_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * COMPANIES_PER_PAGE,
    currentPage * COMPANIES_PER_PAGE
  );

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setCurrentPage(1);
  };

  const handleSearch = q => { setSearchQuery(q); setCurrentPage(1); };

  return (
    <>
      <GlobalStyle />
      
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
                  Companies
                </h1>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: t.muted, marginLeft: 14 }}>
                Overview of all companies with posted job listings
              </p>
            </div>

            <button
              onClick={fetchData}
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
            <StatCard label="Companies" value={allCompanies.length} color={t.accent} icon={BusinessIcon} delay={.1} />
            <StatCard label="Total Jobs" value={totalJobs} color="#0284C7" icon={WorkIcon} delay={.15} />
            <StatCard label="Verified" value={totalVerified} color={t.green} icon={CheckCircleOutlineIcon} delay={.2} />
            <StatCard label="Risky" value={totalRisky} color={t.red} icon={ReportProblemIcon} delay={.25} />
          </div>

          {/* ── Search & View Toggle ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3, duration: .4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <SearchBar value={searchQuery} onChange={handleSearch} />

            <div className="flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <GridViewIcon sx={{ fontSize: 18 }} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <TableRowsIcon sx={{ fontSize: 18 }} />
                Table
              </button>
            </div>
          </motion.div>


          {/* ── Table / Cards ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .4 }}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="shimmer-row" style={{ height: 220, borderRadius: 24 }} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: '48px 20px',
                textAlign: 'center', color: t.muted, fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}>
                No companies match your search.
              </div>
            ) : viewMode === 'grid' || isMobile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((co, i) => (
                  <CompanyCard key={co.companyName} co={co} index={i} />
                ))}
              </div>
            ) : (
              <CompanyTable
                companies={paginated}
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
                totalItems={sorted.length}
                itemsPerPage={COMPANIES_PER_PAGE}
              />
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Companies;