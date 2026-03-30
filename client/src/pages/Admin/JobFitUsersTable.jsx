import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Divider,
    useMediaQuery,
    useTheme,
    Modal,
    CircularProgress,
    Snackbar,
    Alert,
    Avatar,
    Chip,
    InputAdornment,
    Tooltip,
    Fade,
    TableSortLabel,
    Skeleton,
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
    Search,
    People,
    PersonSearch,
    Work,
    Refresh,
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';

/* ── Helpers ──────────────────────────────────────────────── */
const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const roleConfig = {
    Admin: { bg: '#F3E8FF', color: '#6B46C1', border: '#D8B4FE' },
    Recruiter: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
    Candidate: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
};

const avatarColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6'];
const getAvatarColor = (name) => avatarColors[Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarColors.length];

/* ── Stat Card ────────────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const JobFitUserTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
            setError('Failed to fetch users from server.');
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
            setError('Cannot delete an Admin user.');
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
            setSuccess(`Successfully deleted ${userToDelete.name}`);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editName || !editEmail) { setError('Name and email cannot be empty.'); return; }
        if (!editEmail.includes('@')) { setError('Please enter a valid email address.'); return; }

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

            // Update local state
            setUsers(users.map(user =>
                user.id === currentUser.id ? { ...user, name: editName, email: editEmail, status: editStatus } : user
            ));

            setSuccess(`Successfully updated ${currentUser.role} details.`);
            setIsEditModalOpen(false);
            setCurrentUser(null);
        } catch (err) {
            console.error('Error updating user:', err);
            setError(err.response?.data?.message || 'Failed to update user details.');
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    /* ── Filtered + Sorted ────────────────────────────────── */
    const filteredAndSortedUsers = useMemo(() => {
        let list = [...users];
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
        }
        if (filterRole !== 'All') list = list.filter(u => u.role === filterRole);
        if (sortConfig.key) {
            list.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return list;
    }, [users, searchTerm, filterRole, sortConfig]);

    const paginatedUsers = useMemo(() => {
        return filteredAndSortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredAndSortedUsers, page, rowsPerPage]);

    /* ── Reset page on filter change ──────────────────────── */
    useEffect(() => {
        setPage(0);
    }, [searchTerm, filterRole]);

    /* ── Stats ────────────────────────────────────────────── */
    const totalUsers = users.length;
    const totalCandidates = users.filter(u => u.role === 'Candidate').length;
    const totalRecruiters = users.filter(u => u.role === 'Recruiter').length;

    const totalPages = Math.ceil(filteredAndSortedUsers.length / rowsPerPage);

    /* ── Custom Pagination Component ────────────────────── */
    const PaginationUI = () => {
        if (totalPages <= 1) return null;

        return (
            <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    {/* Previous Button */}
                    <IconButton
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        sx={{
                            p: 1.25,
                            borderRadius: '12px',
                            color: '#64748B',
                            '&:disabled': { opacity: 0.3 },
                            '&:hover': { bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
                            transition: 'all 0.2s',
                        }}
                    >
                        <ChevronLeft sx={{ fontSize: 20 }} />
                    </IconButton>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i).map((pIdx) => (
                        <Button
                            key={pIdx}
                            onClick={() => setPage(pIdx)}
                            sx={{
                                minWidth: 40,
                                height: 40,
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                transition: 'all 0.3s',
                                ...(page === pIdx ? {
                                    bgcolor: '#111827 !important',
                                    color: '#FFFFFF',
                                    boxShadow: '0 10px 15px -3px rgba(17, 24, 39, 0.2)',
                                } : {
                                    color: '#64748B',
                                    '&:hover': { bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
                                }),
                            }}
                        >
                            {pIdx + 1}
                        </Button>
                    ))}

                    {/* Next Button */}
                    <IconButton
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page === totalPages - 1}
                        sx={{
                            p: 1.25,
                            borderRadius: '12px',
                            color: '#64748B',
                            '&:disabled': { opacity: 0.3 },
                            '&:hover': { bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
                            transition: 'all 0.2s',
                        }}
                    >
                        <ChevronRight sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>

                {/* Status Page Indicator */}
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} users
                </Typography>
            </Box>
        );
    };
    /* ══════════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════════ */
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', fontFamily: "'Inter', 'Roboto', sans-serif" }}>
            <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    {/* ── Header ──────────────────────────────────── */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: { xs: '1.5rem', md: '1.85rem' }, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                                User Management
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mt: 0.5 }}>
                                Monitor and manage all platform users
                            </Typography>
                        </Box>
                        <Tooltip title="Refresh data">
                            <IconButton
                                onClick={fetchUsers}
                                sx={{
                                    bgcolor: '#F1F5F9', border: '1px solid #E2E8F0',
                                    '&:hover': { bgcolor: '#E2E8F0' }, transition: 'all 0.2s',
                                }}
                            >
                                <Refresh sx={{ fontSize: 20, color: '#475569' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* ── Stat Cards ──────────────────────────────── */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                        <StatCard icon={People} label="Total Users" value={totalUsers} color="#6366F1" delay={0} />
                        <StatCard icon={PersonSearch} label="Candidates" value={totalCandidates} color="#F59E0B" delay={0.08} />
                        <StatCard icon={Work} label="Recruiters" value={totalRecruiters} color="#3B82F6" delay={0.16} />
                    </Box>

                    {/* ── Filters Bar ─────────────────────────────── */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 2.5 }, borderRadius: 3, mb: 3,
                            border: '1px solid #F1F5F9', bgcolor: '#FFFFFF',
                            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                            gap: 2, alignItems: { md: 'center' },
                        }}
                    >
                        <TextField
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            size="small"
                            sx={{
                                flex: 1, minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px', bgcolor: '#F8FAFC',
                                    '& fieldset': { borderColor: '#E2E8F0' },
                                    '&:hover fieldset': { borderColor: '#94A3B8' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                                },
                                '& .MuiInputBase-input': { fontSize: '0.875rem' },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ fontSize: 20, color: '#94A3B8' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Role', options: ['All', 'Recruiter', 'Candidate'], value: filterRole, setter: v => setFilterRole(v) },
                            ].map(({ label, options, value, setter }) => (
                                <FormControl key={label} size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel sx={{ fontSize: '0.8rem', color: '#64748B' }}>{label}</InputLabel>
                                    <Select
                                        value={value}
                                        label={label}
                                        onChange={e => setter(e.target.value)}
                                        sx={{
                                            borderRadius: '10px', fontSize: '0.85rem', bgcolor: '#F8FAFC',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                                        }}
                                    >
                                        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            ))}
                        </Box>

                        <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', whiteSpace: 'nowrap', alignSelf: 'center' }}>
                            {filteredAndSortedUsers.length} result{filteredAndSortedUsers.length !== 1 ? 's' : ''}
                        </Typography>
                    </Paper>

                    {/* ── Table / Cards / Skeleton ───────────────── */}
                    {loading ? (
                        isMobile ? (
                            /* Mobile Skeleton */
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #F1F5F9', bgcolor: '#FFFFFF' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                            <Skeleton variant="circular" width={40} height={40} />
                                            <Box sx={{ flex: 1 }}>
                                                <Skeleton variant="text" width="60%" height={20} />
                                                <Skeleton variant="text" width="40%" height={16} />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                            <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '12px' }} />
                                            <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '12px' }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            <Skeleton variant="rounded" width={60} height={30} sx={{ borderRadius: '8px' }} />
                                            <Skeleton variant="rounded" width={60} height={30} sx={{ borderRadius: '8px' }} />
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            /* Desktop Table Skeleton */
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #F1F5F9', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                            {['User', 'Email', 'Role', 'Actions'].map((h) => (
                                                <TableCell key={h} sx={{ py: 1.8, px: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                                                    <Skeleton variant="text" width={60} />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid #F1F5F9' } }}>
                                                <TableCell sx={{ py: 2, px: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Skeleton variant="circular" width={36} height={36} />
                                                        <Skeleton variant="text" width={100} />
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ py: 2, px: 2.5 }}><Skeleton variant="text" width={150} /></TableCell>
                                                <TableCell sx={{ py: 2, px: 2.5 }}><Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '12px' }} /></TableCell>
                                                <TableCell align="right" sx={{ py: 2, px: 2.5 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                        <Skeleton variant="circular" width={32} height={32} />
                                                        <Skeleton variant="circular" width={32} height={32} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    ) : isMobile ? (
                        /* ── Mobile Card View ───────────────────────── */
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <AnimatePresence>
                                {paginatedUsers.map((user, idx) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5, borderRadius: 3,
                                                border: '1px solid #F1F5F9', bgcolor: '#FFFFFF',
                                                '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' },
                                                transition: 'all 0.25s',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: getAvatarColor(user.name), fontSize: '0.85rem', fontWeight: 600 }}>
                                                    {getInitials(user.name)}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>{user.name}</Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user.email}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    sx={{ bgcolor: roleConfig[user.role]?.bg, color: roleConfig[user.role]?.color, fontWeight: 600, fontSize: '0.7rem', height: 24, border: `1px solid ${roleConfig[user.role]?.border}` }}
                                                />
                                            </Box>
                                            {user.role !== 'Admin' && (
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleEditUser(user)}
                                                        sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#6366F1', borderRadius: 2, '&:hover': { bgcolor: '#EEF2FF' } }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleDeleteUser(user)}
                                                        sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#EF4444', borderRadius: 2, '&:hover': { bgcolor: '#FEF2F2' } }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            )}
                                        </Paper>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredAndSortedUsers.length === 0 && (
                                <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #F1F5F9', bgcolor: '#FFFFFF', textAlign: 'center' }}>
                                    <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>No users found matching your criteria.</Typography>
                                </Paper>
                            )}

                            <PaginationUI />
                        </Box>
                    ) : (
                        /* ── Desktop Table View ─────────────────────── */
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{ borderRadius: 3, border: '1px solid #F1F5F9', bgcolor: '#FFFFFF', overflow: 'hidden' }}
                        >
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                        {[
                                            { label: 'User', field: 'name', align: 'left' },
                                            { label: 'Email', field: 'email', align: 'left' },
                                            { label: 'Role', field: 'role', align: 'left' },
                                            { label: 'Actions', field: null, align: 'right' },
                                        ].map(col => (
                                            <TableCell
                                                key={col.label}
                                                align={col.align}
                                                sortDirection={sortConfig.key === col.field ? sortConfig.direction : false}
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    color: '#475569',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    py: 2,
                                                    px: 2.5,
                                                    borderBottom: '2px solid #F1F5F9',
                                                    bgcolor: '#F8FAFC',
                                                }}
                                            >
                                                {col.field ? (
                                                    <TableSortLabel
                                                        active={sortConfig.key === col.field}
                                                        direction={sortConfig.key === col.field ? sortConfig.direction : 'asc'}
                                                        onClick={() => handleSort(col.field)}
                                                        sx={{
                                                            '&.MuiTableSortLabel-root': {
                                                                color: '#64748B',
                                                                '&:hover': { color: '#0F172A' },
                                                                '&.Mui-active': { color: '#0F172A', '& .MuiTableSortLabel-icon': { color: '#6366F1' } },
                                                            },
                                                        }}
                                                    >
                                                        {col.label}
                                                    </TableSortLabel>
                                                ) : col.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <AnimatePresence>
                                        {paginatedUsers.map((user, idx) => (
                                            <TableRow
                                                key={user.id}
                                                component={motion.tr}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.25, delay: idx * 0.02 }}
                                                sx={{
                                                    '&:hover': { bgcolor: '#F8FAFC' },
                                                    transition: 'background-color 0.2s',
                                                    '& td': { borderBottom: '1px solid #F1F5F9' },
                                                }}
                                            >
                                                {/* User (Avatar + Name) */}
                                                <TableCell sx={{ py: 2, px: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ width: 36, height: 36, bgcolor: getAvatarColor(user.name), fontSize: '0.8rem', fontWeight: 700 }}>
                                                            {getInitials(user.name)}
                                                        </Avatar>
                                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                                                            {user.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Email */}
                                                <TableCell sx={{ py: 2, px: 2.5 }}>
                                                    <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                                                        {user.email}
                                                    </Typography>
                                                </TableCell>

                                                {/* Role */}
                                                <TableCell sx={{ py: 2, px: 2.5 }}>
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
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell align="right" sx={{ py: 2, px: 2.5 }}>
                                                    {user.role !== 'Admin' && (
                                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                            <Tooltip title="Edit user" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleEditUser(user)}
                                                                    sx={{
                                                                        color: '#6366F1', bgcolor: '#EEF2FF',
                                                                        '&:hover': { bgcolor: '#E0E7FF', transform: 'scale(1.05)' },
                                                                        transition: 'all 0.2s', width: 32, height: 32,
                                                                    }}
                                                                >
                                                                    <Edit sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete user" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    sx={{
                                                                        color: '#EF4444', bgcolor: '#FEF2F2',
                                                                        '&:hover': { bgcolor: '#FEE2E2', transform: 'scale(1.05)' },
                                                                        transition: 'all 0.2s', width: 32, height: 32,
                                                                    }}
                                                                >
                                                                    <Delete sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                            {filteredAndSortedUsers.length === 0 && !loading && (
                                <Box sx={{ p: 6, textAlign: 'center' }}>
                                    <PersonSearch sx={{ fontSize: 48, color: '#CBD5E1', mb: 1 }} />
                                    <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                                        No users found matching your criteria.
                                    </Typography>
                                </Box>
                            )}
                            <PaginationUI />
                        </TableContainer>
                    )}

                </motion.div>
            </Container>

            {/* ── Edit Modal ─────────────────────────────────── */}
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
                            <IconButton
                                onClick={handleCloseModal}
                                size="small"
                                sx={{ color: '#94A3B8', '&:hover': { bgcolor: '#F1F5F9' } }}
                            >
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
                                        '&.Mui-focused fieldset': { borderColor: '#6366F1' },
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
                                        '&.Mui-focused fieldset': { borderColor: '#6366F1' },
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
                                        bgcolor: '#6366F1', px: 3,
                                        '&:hover': { bgcolor: '#4F46E5', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
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

            {/* ── Delete Confirmation Dialog ─────────────── */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1, border: '1px solid #F1F5F9' }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0F172A', fontWeight: 700 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Delete sx={{ color: '#EF4444', fontSize: 20 }} />
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
                            bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' },
                            boxShadow: 'none', minWidth: 140,
                        }}
                    >
                        {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Error Snackbar ──────────────────────────────── */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setError(null)} severity="error" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {error}
                </Alert>
            </Snackbar>

            {/* ── Success Snackbar ────────────────────────────── */}
            <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSuccess(null)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default JobFitUserTable;