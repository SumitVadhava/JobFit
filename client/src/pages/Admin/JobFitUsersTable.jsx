import React, { useState, useMemo } from 'react';
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
    Grid,
    Divider,
    useMediaQuery,
    useTheme,
    Modal,
} from '@mui/material';
import { Edit, Delete, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

const JobFitUserTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [users, setUsers] = useState([
        { id: 1, name: 'Ethan Harper', email: 'ethan.harper@email.com', role: 'Recruiter', lastActive: '2023-11-15' },
        { id: 2, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', role: 'Recruiter', lastActive: '2023-11-14' },
        { id: 3, name: 'Noah Carter', email: 'noah.carter@email.com', role: 'Candidate', lastActive: '2023-11-13' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilter = (type, value) => {
        if (type === 'Role') setFilterRole(value);
    };

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleEditUser = (user) => {
        if (user.role === 'Admin') return;
        setCurrentUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (userId) => {
        const user = users.find((u) => u.id === userId);
        if (user.role === 'Admin') {
            alert('Cannot delete an Admin user.');
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            setUsers(users.filter((u) => u.id !== userId));
        }
    };

    const handleSaveEdit = () => {
        if (!editName || !editEmail) {
            alert('Name and email cannot be empty.');
            return;
        }
        if (!editEmail.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        setUsers(users.map((user) =>
            user.id === currentUser.id ? { ...user, name: editName, email: editEmail } : user
        ));
        setIsEditModalOpen(false);
        setCurrentUser(null);
        setEditName('');
        setEditEmail('');
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setCurrentUser(null);
        setEditName('');
        setEditEmail('');
    };

    const filteredAndSortedUsers = useMemo(() => {
        let filteredUsers = [...users];

        if (searchTerm) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterRole !== 'All') {
            filteredUsers = filteredUsers.filter((user) => user.role === filterRole);
        }



        if (sortConfig.key) {
            filteredUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filteredUsers;
    }, [users, searchTerm, filterRole, sortConfig]);



    const roleColors = {
        Admin: { bg: '#F3E8FF', color: '#6B46C1' },
        Recruiter: { bg: '#E3F2FD', color: '#1565C0' },
        Candidate: { bg: '#FEF3C7', color: '#D97706' },
    };

    const renderTable = () => (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(107, 70, 193, 0.1)',
                overflowX: 'auto',
                minHeight: { xs: '300px', sm: '400px', md: '500px' },
                bgcolor: '#FFFFFF',
                border: '1px solid #E9D5FF',
                maxWidth: { xs: '95%', sm: '90%', md: '1000px' },
                width: 'fit-content',
                mx: 'auto',
            }}
        >
            <Table sx={{ minWidth: { sm: 650, md: 900 }, width: '100%' }} stickyHeader>
                <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                    <TableRow>
                        {[
                            'Name',
                            ...(isMobile ? [] : ['Email', 'Last Active']),
                            'Role',
                            'Actions',
                        ].map((head) => (
                            <TableCell
                                key={head}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    color: '#1A1A1A',
                                    textAlign: head === 'Actions' ? 'right' : 'left',
                                    whiteSpace: 'nowrap',
                                    bgcolor: '#F9FAFB',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                    py: { xs: 1.5, sm: 2 },
                                    px: { xs: 1, sm: 2, md: 3 },
                                }}
                                onClick={() => head !== 'Actions' && handleSort(head.toLowerCase())}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {head}
                                    {sortConfig.key === head.toLowerCase() && (
                                        <Box component="span" sx={{ fontSize: { xs: 12, sm: 14 } }}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </Box>
                                    )}
                                </Box>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAndSortedUsers.map((user) => (
                        <TableRow
                            key={user.id}
                            sx={{
                                '&:hover': {
                                    bgcolor: '#F3E8FF',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(107, 70, 193, 0.1)',
                                },
                                transition: 'all 0.3s ease',
                                bgcolor: '#FFFFFF',
                                borderRadius: '8px',
                                m: 1,
                                display: 'table-row',
                            }}
                        >
                            <TableCell
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    color: '#1A1A1A',
                                    whiteSpace: 'nowrap',
                                    py: { xs: 1.5, sm: 2 },
                                    px: { xs: 1, sm: 2, md: 3 },
                                }}
                            >
                                {user.name}
                            </TableCell>
                            {!isMobile && (
                                <>
                                    <TableCell
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                            color: '#4A4A4A',
                                            py: { xs: 1.5, sm: 2 },
                                            px: { xs: 1, sm: 2, md: 3 },
                                        }}
                                    >
                                        {user.email}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                            color: '#4A4A4A',
                                            py: { xs: 1.5, sm: 2 },
                                            px: { xs: 1, sm: 2, md: 3 },
                                        }}
                                    >
                                        {user.lastActive}
                                    </TableCell>
                                </>
                            )}
                            <TableCell
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    py: { xs: 1.5, sm: 2 },
                                    px: { xs: 1, sm: 2, md: 3 },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '6px',
                                        bgcolor: roleColors[user.role].bg,
                                        color: roleColors[user.role].color,
                                        fontWeight: 500,
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                    }}
                                >
                                    {user.role}
                                </Box>
                            </TableCell>

                            <TableCell
                                sx={{
                                    textAlign: 'right',
                                    py: { xs: 1.5, sm: 2 },
                                    px: { xs: 1, sm: 2, md: 3 },
                                }}
                            >
                                {user.role !== 'Admin' && (
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <IconButton
                                            onClick={() => handleEditUser(user)}
                                            sx={{
                                                color: '#6B46C1',
                                                '&:hover': { color: '#5A3DA6', transform: 'scale(1.1)' },
                                                transition: 'all 0.3s ease',
                                            }}
                                            title="Edit"
                                        >
                                            <Edit sx={{ fontSize: { xs: 16, sm: 20 } }} />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteUser(user.id)}
                                            sx={{
                                                color: '#DC2626',
                                                '&:hover': { color: '#B91C1C', transform: 'scale(1.1)' },
                                                transition: 'all 0.3s ease',
                                            }}
                                            title="Delete"
                                        >
                                            <Delete sx={{ fontSize: { xs: 16, sm: 20 } }} />
                                        </IconButton>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {filteredAndSortedUsers.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center', color: '#6B7280', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    No users found matching the criteria.
                </Box>
            )}
        </TableContainer>
    );

    const renderCards = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, maxWidth: '95%', mx: 'auto' }}>
            {filteredAndSortedUsers.map((user) => (
                <Paper
                    key={user.id}
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(107, 70, 193, 0.1)',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #E9D5FF',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(107, 70, 193, 0.15)',
                        },
                        transition: 'all 0.3s ease',
                        p: { xs: 2, sm: 2.5 },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            color: '#1A1A1A',
                            fontWeight: 600,
                            mb: 1,
                        }}
                    >
                        {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                color: '#4A4A4A',
                            }}
                        >
                            Email: {user.email}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                color: '#4A4A4A',
                            }}
                        >
                            Last Active: {user.lastActive}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Role:{' '}
                            <Box
                                component="span"
                                sx={{
                                    display: 'inline-flex',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: '6px',
                                    bgcolor: roleColors[user.role].bg,
                                    color: roleColors[user.role].color,
                                    fontWeight: 500,
                                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                }}
                            >
                                {user.role}
                            </Box>
                        </Typography>

                        {user.role !== 'Admin' && (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleEditUser(user)}
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        bgcolor: '#6B46C1',
                                        '&:hover': {
                                            bgcolor: '#5A3DA6',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 4px rgba(107, 70, 193, 0.2)',
                                        },
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        padding: { xs: '4px 6px', sm: '5px 8px' },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleDeleteUser(user.id)}
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        borderColor: '#DC2626',
                                        color: '#DC2626',
                                        '&:hover': {
                                            borderColor: '#B91C1C',
                                            color: '#B91C1C',
                                            bgcolor: '#FFE4E6',
                                            transform: 'translateY(-1px)',
                                        },
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        padding: { xs: '4px 6px', sm: '5px 8px' },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Paper>
            ))}
        </Box>
    );

    return (
        <motion.div
            style={{
                fontFamily: "'Inter', 'Roboto', sans-serif",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: '#F9FAFB',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    maxWidth: { xs: '95%', sm: '90%', md: '1280px' },
                    mx: 'auto',
                    py: { xs: 2, sm: 4, md: 5 },
                    px: { xs: 1, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center">
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3, ml: 6, maxWidth: { xs: '95%', sm: '90%', md: '1000px' }, textAlign: 'center', justifyContent: 'center' }}>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                                    color: '#1A1A1A',
                                }}
                            >
                                Users
                            </Typography>
                            {/* <Typography
                                variant="body2"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    color: '#6B7280',
                                }}
                            >
                                Manage users and their accounts
                            </Typography> */}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ maxWidth: { xs: '95%', sm: '90%', md: '1000px' }, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                            <TextField
                                placeholder="Search users by name or email"
                                value={searchTerm}
                                onChange={handleSearch}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 1, color: '#6B7280' }}>
                                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M229.66 218.34l-50.07-50.06a88 88 0 1 0-11.32 11.31l50.07 50.07a8 8 0 0 0 11.32-11.32zM40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72z" />
                                            </svg>
                                        </Box>
                                    ),
                                }}
                                sx={{
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '& fieldset': { borderColor: '#E9D5FF' },
                                        '&:hover fieldset': { borderColor: '#A78BFA' },
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 }, justifyContent: 'center' }}>
                                {[
                                    { label: 'Role', options: ['All', 'Admin', 'Recruiter', 'Candidate'] },
                                ].map(({ label, options }) => (
                                    <FormControl key={label} sx={{ minWidth: { xs: '100%', sm: 120, md: 150 } }}>
                                        <InputLabel sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                            color: '#6B46C1',
                                        }}>
                                            {label}
                                        </InputLabel>
                                        <Select
                                            value={filterRole}
                                            label={label}
                                            onChange={(e) => handleFilter(label, e.target.value)}
                                            size="small"
                                            sx={{
                                                borderRadius: '8px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#E9D5FF',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#A78BFA',
                                                },
                                                '& .MuiSelect-select': {
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                },
                                            }}
                                        >
                                            {options.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ))}
                                <Button
                                    variant="outlined"
                                    onClick={() => handleSort('lastActive')}
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.7rem', sm: '0.875rem', md: '1rem' },
                                        borderColor: '#E9D5FF',
                                        color: '#6B46C1',
                                        '&:hover': {
                                            borderColor: '#A78BFA',
                                            bgcolor: '#F3E8FF',
                                        },
                                        py: { xs: 0.5, sm: 1 },
                                    }}
                                >
                                    Sort by Date {sortConfig.key === 'lastActive' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isMobile ? renderCards() : renderTable()}
                    </Grid>
                </Grid>
            </Container>
            <Modal
                open={isEditModalOpen}
                onClose={handleCloseModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, sm: 0 } }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ maxWidth: '400px', width: '100%' }}
                >
                    <Paper
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderRadius: 3,
                            bgcolor: '#FFFFFF',
                            border: '1px solid #E9D5FF',
                            boxShadow: '0 4px 12px rgba(107, 70, 193, 0.1)',
                            width: { xs: '100%', sm: '400px' },
                            mx: 'auto',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                    color: '#1A1A1A',
                                    fontWeight: 600,
                                }}
                            >
                                Edit User
                            </Typography>
                            <IconButton onClick={handleCloseModal}>
                                <Close sx={{ color: '#6B46C1', fontSize: { xs: 20, sm: 24 } }} />
                            </IconButton>
                        </Box>
                        <Divider sx={{ mb: 2, borderColor: '#E9D5FF' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '& fieldset': { borderColor: '#E9D5FF' },
                                        '&:hover fieldset': { borderColor: '#A78BFA' },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#6B46C1',
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    },
                                }}
                            />
                            <TextField
                                label="Email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="email"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '& fieldset': { borderColor: '#E9D5FF' },
                                        '&:hover fieldset': { borderColor: '#A78BFA' },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#6B46C1',
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        borderColor: '#E9D5FF',
                                        color: '#6B46C1',
                                        '&:hover': {
                                            borderColor: '#A78BFA',
                                            bgcolor: '#F3E8FF',
                                        },
                                        py: { xs: 0.5, sm: 1 },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveEdit}
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        bgcolor: '#6B46C1',
                                        '&:hover': {
                                            bgcolor: '#5A3DA6',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 4px rgba(107, 70, 193, 0.2)',
                                        },
                                        py: { xs: 0.5, sm: 1 },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>
            </Modal>
        </motion.div>
    );
};

export default JobFitUserTable;