import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
    Divider,
    useMediaQuery,
    useTheme,
    Modal,
    CircularProgress,
    Avatar,
    Chip,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    Edit,
    Delete,
    Close,
    People,
    PersonSearch,
    Work,
    Refresh,
    GridView,
    TableRows,
    ChevronRight,
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../api/api';

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

const roleConfig = {
    Admin: { bg: '#F3E8FF', color: '#6B46C1', border: '#D8B4FE' },
    Recruiter: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
    Candidate: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
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

/* ─── Helpers ──────────────────────────────────────────────── */
const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const avatarColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6'];
const getAvatarColor = (name) => avatarColors[Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarColors.length];

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
            placeholder="Search by name or email…"
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
        { key: 'Recruiter', label: 'Recruiters', count: counts.recruiters },
        { key: 'Candidate', label: 'Candidates', count: counts.candidates },
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
    const start = currentPage * itemsPerPage + 1;
    const end = Math.min((currentPage + 1) * itemsPerPage, totalItems);

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
                    disabled={currentPage === 0}
                    style={{
                        padding: 10, borderRadius: 12, border: 'none', background: 'transparent',
                        color: '#6B7280', cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 0 ? 0.3 : 1, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (currentPage !== 0) { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
                    </svg>
                </button>

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
                        {page + 1}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                    style={{
                        padding: 10, borderRadius: 12, border: 'none', background: 'transparent',
                        color: '#6B7280', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages - 1 ? 0.3 : 1, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (currentPage !== totalPages - 1) { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                    </svg>
                </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', fontFamily: "'Inter', sans-serif", marginTop: 16, marginBottom: 32 }}>
                Showing {start}–{end} of {totalItems} user{totalItems !== 1 ? 's' : ''}
            </p>
        </div>
    );
};

/* ─── User Table ─── */
const SORTABLE_COLS = [
    { key: 'name', label: 'User' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: null, label: 'Actions' },
];

const UserTable = ({ users, onEdit, onDelete, loading, sortKey, sortDir, onSort }) => (
    <div style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(107, 70, 193, 0.05)',
    }}>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                        {SORTABLE_COLS.map(col => (
                            <th
                                key={col.label}
                                className={col.key ? 'sort-th' : ''}
                                onClick={() => col.key && onSort(col.key)}
                                style={{
                                    padding: '16px 20px', textAlign: col.label === 'Actions' ? 'right' : 'left',
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
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '60px 20px', textAlign: 'center', color: t.muted, fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
                                        No users match the current filters.
                                    </td>
                                </tr>
                            )}
                            <AnimatePresence>
                                {users.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <Avatar sx={{ width: 36, height: 36, bgcolor: getAvatarColor(user.name), fontSize: '0.8rem', fontWeight: 700 }}>
                                                    {getInitials(user.name)}
                                                </Avatar>
                                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: t.text, fontWeight: 600 }}>
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: t.muted, fontWeight: 500 }}>
                                                {user.email}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                sx={{
                                                    bgcolor: roleConfig[user.role]?.bg || '#F1F5F9',
                                                    color: roleConfig[user.role]?.color || '#475569',
                                                    fontWeight: 600, fontSize: '0.75rem', height: 26,
                                                    border: `1px solid ${roleConfig[user.role]?.border || '#E2E8F0'}`,
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            {user.role !== 'Admin' && (
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(user)}
                                                        sx={{
                                                            color: t.accent, bgcolor: `${t.accent}10`,
                                                            '&:hover': { bgcolor: `${t.accent}20` },
                                                            width: 32, height: 32,
                                                        }}
                                                    >
                                                        <Edit sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDelete(user)}
                                                        sx={{
                                                            color: t.red, bgcolor: `${t.red}10`,
                                                            '&:hover': { bgcolor: `${t.red}20` },
                                                            width: 32, height: 32,
                                                        }}
                                                    >
                                                        <Delete sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </div>
                                            )}
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

/* ─── User Card (Grid View) ─── */


const UserCard = ({ user, onEdit, onDelete, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
        <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4">
                <Avatar 
                    sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: getAvatarColor(user.name), 
                        fontSize: '1.2rem', 
                        fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                >
                    {getInitials(user.name)}
                </Avatar>
                <Chip
                    label={user.role}
                    size="small"
                    sx={{
                        bgcolor: roleConfig[user.role]?.bg || '#F1F5F9',
                        color: roleConfig[user.role]?.color || '#475569',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 24,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: `1px solid ${roleConfig[user.role]?.border || '#E2E8F0'}`,
                    }}
                />
            </div>

            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                {user.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium truncate mb-4">
                {user.email}
            </p>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    ID: {user.id.slice(-6)}
                </span>
                <div className="flex gap-2">
                    {user.role !== 'Admin' && (
                        <>
                            <IconButton
                                size="small"
                                onClick={() => onEdit(user)}
                                sx={{
                                    color: t.accent, bgcolor: `${t.accent}10`,
                                    '&:hover': { bgcolor: `${t.accent}20` },
                                    width: 32, height: 32,
                                }}
                            >
                                <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => onDelete(user)}
                                sx={{
                                    color: t.red, bgcolor: `${t.red}10`,
                                    '&:hover': { bgcolor: `${t.red}20` },
                                    width: 32, height: 32,
                                }}
                            >
                                <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className="px-6 pb-6 mt-auto">
            <button 
                onClick={() => onEdit(user)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 font-bold text-sm hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
            >
                View Profile
                <ChevronRight sx={{ fontSize: 18 }} />
            </button>
        </div>
    </motion.div>
);


/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const USERS_PER_PAGE = 8;

const JobFitUserTable = () => {
    const theme = useTheme();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editStatus, setEditStatus] = useState('active');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(0);


    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    /* ── Fetch ────────────────────────────────────────────── */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const [candidatesRes, recruitersRes] = await Promise.all([
                api.get('/admin/candidates'),
                api.get('/admin/recruiters'),
            ]);

            const candidates = (candidatesRes.data?.data || []).map(u => ({
                id: u._id,
                name: u.userName || 'Unknown',
                email: u.email,
                role: 'Candidate',
                status: u.status || 'active',
            }));

            const recruiters = (recruitersRes.data?.data || []).map(u => ({
                id: u._id,
                name: u.userName || 'Unknown',
                email: u.email,
                role: 'Recruiter',
                status: u.status || 'active',
            }));

            setUsers([...candidates, ...recruiters]);
        } catch (err) {
            console.error('Error fetching users:', err);
            toast.error('Failed to fetch users from server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    /* ── Handlers ─────────────────────────────────────────── */
    const handleSort = (key) =>
        setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

    const handleEditUser = (user) => {
        if (user.role === 'Admin') return;
        setCurrentUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditStatus(user.status || 'active');
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        if (user.role === 'Admin') {
            toast.error('Cannot delete an Admin user.');
            return;
        }
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            const endpoint = userToDelete.role === 'Candidate'
                ? `/admin/candidates/${userToDelete.id}`
                : `/admin/recruiters/${userToDelete.id}`;

            await api.delete(endpoint);

            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast.success(`Successfully deleted ${userToDelete.name}`);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editName || !editEmail) { toast.error('Name and email cannot be empty.'); return; }
        if (!editEmail.includes('@')) { toast.error('Please enter a valid email address.'); return; }

        try {
            setIsSaving(true);
            const endpoint = currentUser.role === 'Candidate'
                ? `/admin/candidates/${currentUser.id}`
                : `/admin/recruiters/${currentUser.id}`;

            const payload = {
                userName: editName,
                email: editEmail,
                status: editStatus
            };

            await api.put(endpoint, payload);

            setUsers(users.map(user =>
                user.id === currentUser.id ? { ...user, name: editName, email: editEmail, status: editStatus } : user
            ));

            toast.success(`Successfully updated ${currentUser.role} details.`);
            setIsEditModalOpen(false);
            setCurrentUser(null);
        } catch (err) {
            console.error('Error updating user:', err);
            toast.error(err.response?.data?.message || 'Failed to update user details.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setCurrentUser(null);
        setEditName('');
        setEditEmail('');
    };

    /* ── Filtered + Sorted ────────────────────────────────── */
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchRole = filterRole === 'All' || u.role === filterRole;
            const q = searchTerm.toLowerCase();
            const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
            return matchRole && matchSearch;
        });
    }, [users, searchTerm, filterRole]);

    const sortedUsers = useMemo(() => {
        const list = [...filteredUsers];
        if (sortConfig.key) {
            list.sort((a, b) => {
                let aVal = a[sortConfig.key] || '';
                let bVal = b[sortConfig.key] || '';
                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return list;
    }, [filteredUsers, sortConfig]);

    const paginatedUsers = useMemo(() => {
        return sortedUsers.slice(page * USERS_PER_PAGE, (page + 1) * USERS_PER_PAGE);
    }, [sortedUsers, page]);

    const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);

    /* ── Reset page on filter change ──────────────────────── */
    useEffect(() => { setPage(0); }, [searchTerm, filterRole, sortConfig]);

    /* ── Stats ────────────────────────────────────────────── */
    const counts = {
        all: users.length,
        candidates: users.filter(u => u.role === 'Candidate').length,
        recruiters: users.filter(u => u.role === 'Recruiter').length,
    };

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
                                    User Management
                                </h1>
                            </div>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: t.muted, marginLeft: 14 }}>
                                Monitor and manage all platform users
                            </p>
                        </div>

                        <button
                            onClick={fetchUsers}
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
                            <Refresh sx={{ fontSize: 14 }} />
                            Refresh
                        </button>
                    </motion.div>

                    {/* ── Stat Cards ── */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <StatCard icon={People} label="Total Users" value={counts.all} color={t.accent} delay={0.1} />
                        <StatCard icon={PersonSearch} label="Candidates" value={counts.candidates} color={t.amber} delay={0.15} />
                        <StatCard icon={Work} label="Recruiters" value={counts.recruiters} color="#3B82F6" delay={0.2} />
                    </div>

                    {/* ── Search & Filters ── */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <SearchBar value={searchTerm} onChange={setSearchTerm} />
                        <TabBar active={filterRole} onChange={setFilterRole} counts={counts} />
                    </div>

                    {/* ── Content ── */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .4 }}>
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-200">
                                <CircularProgress sx={{ color: t.accent, mb: 2 }} />
                                <p className="text-sm font-medium text-gray-400 animate-pulse">Syncing user directory...</p>
                            </div>
                        ) : paginatedUsers.length === 0 ? (
                            <div style={{
                                background: t.card, border: `1px solid ${t.border}`,
                                borderRadius: 24, padding: '80px 20px',
                                textAlign: 'center', color: t.muted, fontSize: 14,
                                fontFamily: "'Inter', sans-serif"
                            }}>
                                <PersonSearch sx={{ fontSize: 48, color: t.accent, opacity: 0.2, mb: 2 }} />
                                <p className="font-bold text-slate-900 text-lg">No Users Found</p>
                                <p className="text-slate-500 mt-1">Try adjusting your filters or search term.</p>
                            </div>
                        ) : (
                            <>
                                <UserTable
                                    users={paginatedUsers}
                                    onEdit={handleEditUser}
                                    onDelete={handleDeleteUser}
                                    loading={loading}
                                    sortKey={sortConfig.key}
                                    sortDir={sortConfig.direction}
                                    onSort={handleSort}
                                />
                                {/* ── Pagination ── */}
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    totalItems={sortedUsers.length}
                                    itemsPerPage={USERS_PER_PAGE}
                                />
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ── Edit Modal ── */}
            <Modal
                open={isEditModalOpen}
                onClose={handleCloseModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}
            >
                <Fade in={isEditModalOpen}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 4 }, borderRadius: 4, maxWidth: 440, width: '100%',
                            bgcolor: '#FFFFFF', border: '1px solid #E2E8F0',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                                Edit User
                            </Typography>
                            <IconButton onClick={handleCloseModal} size="small" sx={{ color: '#94A3B8', '&:hover': { bgcolor: '#F1F5F9' } }}>
                                <Close sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                        <Divider sx={{ mb: 3, borderColor: '#F1F5F9' }} />

                        {currentUser && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5 }}>
                                <Avatar sx={{ width: 44, height: 44, bgcolor: getAvatarColor(currentUser.name), fontWeight: 700, fontSize: '0.9rem' }}>
                                    {getInitials(currentUser.name)}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{currentUser.name}</Typography>
                                    <Chip label={currentUser.role} size="small" sx={{ mt: 0.5, bgcolor: roleConfig[currentUser.role]?.bg, color: roleConfig[currentUser.role]?.color, fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Name"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                fullWidth size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: '#94A3B8' },
                                        '&.Mui-focused fieldset': { borderColor: t.accent },
                                    },
                                    '& .MuiInputLabel-root': { color: '#64748B', fontSize: '0.85rem' },
                                }}
                            />
                            <TextField
                                label="Email"
                                value={editEmail}
                                onChange={e => setEditEmail(e.target.value)}
                                fullWidth size="small" type="email"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: '#94A3B8' },
                                        '&.Mui-focused fieldset': { borderColor: t.accent },
                                    },
                                    '& .MuiInputLabel-root': { color: '#64748B', fontSize: '0.85rem' },
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    disabled={isSaving}
                                    sx={{
                                        borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem',
                                        borderColor: '#E2E8F0', color: '#64748B', px: 3,
                                        '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                                    sx={{
                                        borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem',
                                        bgcolor: t.accent, px: 3,
                                        '&:hover': { bgcolor: t.accent, boxShadow: `0 4px 12px ${t.accent}40` },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1, border: `1px solid ${t.border}` } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0F172A', fontWeight: 700 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: t.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Delete sx={{ color: t.red, fontSize: 20 }} />
                    </Box>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#64748B', fontSize: '0.95rem', mt: 1 }}>
                        Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
                        This action cannot be undone and will remove all associated data.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1.5 }}>
                    <Button
                        onClick={() => setIsDeleteModalOpen(false)}
                        disabled={isDeleting}
                        sx={{
                            textTransform: 'none', fontWeight: 600, px: 2.5, borderRadius: 2,
                            color: '#64748B', '&:hover': { bgcolor: '#F8FAFC' }
                        }}
                    >
                        Keep User
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{
                            textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 2,
                            bgcolor: t.red, '&:hover': { bgcolor: t.red },
                            boxShadow: 'none', minWidth: 140,
                        }}
                    >
                        {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

};

export default JobFitUserTable;