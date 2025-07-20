// import React, { useState, useMemo } from 'react';

// const JobFitUserTable = () => {

//     const [users, setUsers] = useState([
//         { id: 1, name: "Ethan Harper", email: "ethan.harper@email.com", role: "Admin", status: "Active", lastActive: "2023-11-15" },
//         { id: 2, name: "Olivia Bennett", email: "olivia.bennett@email.com", role: "Recruiter", status: "Active", lastActive: "2023-11-14" },
//         { id: 3, name: "Noah Carter", email: "noah.carter@email.com", role: "Candidate", status: "Inactive", lastActive: "2023-11-13" },
//     ]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterRole, setFilterRole] = useState('All');
//     const [filterStatus, setFilterStatus] = useState('All');
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [editName, setEditName] = useState('');
//     const [editEmail, setEditEmail] = useState('');

//         // ✅ Fetch users from backend when component mounts
//     // useEffect(() => {
//     //     const fetchUsers = async () => {
//     //         try {
//     //             const res = await axios.get("http://localhost:5000/api/users");
//     //             setUsers(res.data);
//     //             console.log("Fetched Users:", res.data); // 👈 Show data in console
//     //         } catch (error) {
//     //             console.error("Error fetching users:", error);
//     //         }
//     //     };

//     //     fetchUsers();
//     // }, []);

//     const handleSearch = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const handleFilter = (type, value) => {
//         if (type === 'Role') setFilterRole(value);
//         if (type === 'Status') setFilterStatus(value);
//     };

//     const handleSort = (key) => {
//         setSortConfig(prev => ({
//             key,
//             direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
//         }));
//     };

//     const handleViewUser = (userId) => {
//         alert(`Viewing user profile for ID: ${userId}`);
//     };

//     const handleEditUser = (user) => {
//         if (user.role === 'Admin') return;
//         setCurrentUser(user);
//         setEditName(user.name);
//         setEditEmail(user.email);
//         setIsEditModalOpen(true);
//     };

//     const handleDeleteUser = (userId) => {
//         const user = users.find(u => u.id === userId);
//         if (user.role === 'Admin') {
//             alert("Cannot delete an Admin user.");
//             return;
//         }
//         if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
//             setUsers(users.filter(u => u.id !== userId));
//         }
//     };

//     const handleSaveEdit = () => {
//         if (!editName || !editEmail) {
//             alert("Name and email cannot be empty.");
//             return;
//         }
//         if (!editEmail.includes('@')) {
//             alert("Please enter a valid email address.");
//             return;
//         }
//         setUsers(users.map(user =>
//             user.id === currentUser.id ? { ...user, name: editName, email: editEmail } : user
//         ));
//         setIsEditModalOpen(false);
//         setCurrentUser(null);
//         setEditName('');
//         setEditEmail('');
//     };

//     const handleCloseModal = () => {
//         setIsEditModalOpen(false);
//         setCurrentUser(null);
//         setEditName('');
//         setEditEmail('');
//     };

//     const filteredAndSortedUsers = useMemo(() => {
//         let filteredUsers = [...users];

//         if (searchTerm) {
//             filteredUsers = filteredUsers.filter(user =>
//                 user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.email.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         if (filterRole !== 'All') {
//             filteredUsers = filteredUsers.filter(user => user.role === filterRole);
//         }

//         if (filterStatus !== 'All') {
//             filteredUsers = filteredUsers.filter(user => user.status === filterStatus);
//         }

//         if (sortConfig.key) {
//             filteredUsers.sort((a, b) => {
//                 if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
//                 if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
//                 return 0;
//             });
//         }

//         return filteredUsers;
//     }, [users, searchTerm, filterRole, filterStatus, sortConfig]);

//     return (
//         <div className="relative min-h-screen bg-gray-50 font-sans">
//             <div className="flex flex-col h-full">
//                 {/* <header className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4 bg-white shadow-sm">
//                     <div className="flex items-center gap-3">
//                         <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 48 48" fill="currentColor">
//                             <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
//                         </svg>
//                         <h2 className="text-lg sm:text-xl font-semibold text-gray-800">JobFit Pro</h2>
//                     </div>
//                 </header> */}

//                 <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-center flex-1">
//                     <div className="w-full max-w-full sm:max-w-6xl">
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
//                             <div className="flex flex-col gap-2">
//                                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users</h1>
//                                 <p className="text-sm text-gray-500">Manage users and their accounts</p>
//                             </div>
//                         </div>

//                         <div className="mt-4 px-4">
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
//                                         <path d="M229.66 218.34l-50.07-50.06a88 88 0 1 0-11.32 11.31l50.07 50.07a8 8 0 0 0 11.32-11.32zM40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72z"/>
//                                     </svg>
//                                 </div>
//                                 <input
//                                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
//                                     placeholder="Search users by name or email"
//                                     value={searchTerm}
//                                     onChange={handleSearch}
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 p-4">
//                             {[
//                                 { label: 'Role', options: ['All', 'Admin', 'Recruiter', 'Candidate'] },
//                                 { label: 'Status', options: ['All', 'Active', 'Inactive'] }
//                             ].map(({ label, options }) => (
//                                 <div key={label} className="relative w-full sm:w-auto">
//                                     <select
//                                         className="h-10 px-4 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 appearance-none w-full"
//                                         onChange={(e) => handleFilter(label, e.target.value)}
//                                         value={label === 'Role' ? filterRole : filterStatus}
//                                     >
//                                         {options.map(option => (
//                                             <option key={option} value={option}>{option}</option>
//                                         ))}
//                                     </select>
//                                     <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
//                                         <path d="M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32z"/>
//                                     </svg>
//                                 </div>
//                             ))}
//                             <button
//                                 className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 hover:bg-gray-50 w-full sm:w-auto"
//                                 onClick={() => handleSort('lastActive')}
//                             >
//                                 Sort by Date {sortConfig.key === 'lastActive' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                             </button>
//                         </div>

//                         <div className="mt-4 px-4">
//                             <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50 hidden sm:table-header-group">
//                                         <tr>
//                                             {['Name', 'Email', 'Role', 'Status', 'Last Active', 'Actions'].map((head) => (
//                                                 <th
//                                                     key={head}
//                                                     className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-800 cursor-pointer hover:bg-gray-100"
//                                                     onClick={() => head !== 'Actions' && handleSort(head.toLowerCase())}
//                                                 >
//                                                     <div className="flex items-center gap-2">
//                                                         {head}
//                                                         {sortConfig.key === head.toLowerCase() && (
//                                                             <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
//                                                                 <path d={sortConfig.direction === 'asc' ? 
//                                                                     "M128 40l80 80H48z" : 
//                                                                     "M128 216l-80-80h160z"}/>
//                                                             </svg>
//                                                         )}
//                                                     </div>
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200">
//                                         {filteredAndSortedUsers.map((user) => (
//                                             <tr key={user.id} className="flex flex-col sm:table-row hover:bg-gray-50 transition-colors">
//                                                 <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-gray-800 sm:table-cell">
//                                                     <span className="sm:hidden font-semibold">Name: </span>{user.name}
//                                                 </td>
//                                                 <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-gray-500 sm:table-cell">
//                                                     <span className="sm:hidden font-semibold">Email: </span>{user.email}
//                                                 </td>
//                                                 <td className="px-4 sm:px-6 py-2 sm:py-4 sm:table-cell">
//                                                     <span className="sm:hidden font-semibold">Role: </span>
//                                                     <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                                                         {user.role}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 sm:px-6 py-2 sm:py-4 sm:table-cell">
//                                                     <span className="sm:hidden font-semibold">Status: </span>
//                                                     <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//                                                         user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                                                     }`}>
//                                                         {user.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-gray-500 sm:table-cell">
//                                                     <span className="sm:hidden font-semibold">Last Active: </span>{user.lastActive}
//                                                 </td>
//                                                 <td className="px-4 sm:px-6 py-2 sm:py-4 flex gap-2 sm:table-cell">
//                                                     <span className="sm:hidden font-semibold">Actions: </span>
//                                                     <button
//                                                         className="text-indigo-600 hover:text-indigo-800"
//                                                         onClick={() => handleViewUser(user.id)}
//                                                         title="View"
//                                                     >
//                                                         <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
//                                                             <path d="M128 56c-78 0-118.76 85.23-120.21 87.18a8 8 0 0 0 0 9.64C9.24 154.77 49.95 240 128 240s118.76-85.23 120.21-87.18a8 8 0 0 0 0-9.64C246.76 141.23 206.05 56 128 56zm0 168c-44.11 0-80-40.17-80-88s35.89-88 80-88 80 40.17 80 88-35.89 88-80 88zm0-136a40 40 0 1 0 40 40 40 40 0 0 0-40-40zm0 64a24 24 0 1 1 24-24 24 24 0 0 1-24 24z"/>
//                                                         </svg>
//                                                     </button>
//                                                     {user.role !== 'Admin' && (
//                                                         <>
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-800"
//                                                                 onClick={() => handleEditUser(user)}
//                                                                 title="Edit"
//                                                             >
//                                                                 <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
//                                                                     <path d="M227.31 73.37 182.63 28.68a16 16 0 0 0-22.63 0L36.69 152a16 16 0 0 0-4.69 11.32V208a16 16 0 0 0 16 16h44.69a16 16 0 0 0 11.31-4.69l123.32-123.31a16 16 0 0 0 0-22.63zM92.69 208H48v-44.69l88-88 44.69 44.69zm96-96-44.69-44.69L184 24l44.69 44.69z"/>
//                                                                 </svg>
//                                                             </button>
//                                                             <button
//                                                                 className="text-red-600 hover:text-red-800"
//                                                                 onClick={() => handleDeleteUser(user.id)}
//                                                                 title="Delete"
//                                                             >
//                                                                 <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
//                                                                     <path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16zM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96zm96 168H64V64h128zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0z"/>
//                                                                 </svg>
//                                                             </button>
//                                                         </>
//                                                     )}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                                 {filteredAndSortedUsers.length === 0 && (
//                                     <div className="p-6 text-center text-gray-500 text-sm sm:text-base">
//                                         No users found matching the criteria.
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {isEditModalOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
//                         <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                             <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Edit User</h2>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     type="text"
//                                     className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                                     value={editName}
//                                     onChange={(e) => setEditName(e.target.value)}
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                                 <input
//                                     type="email"
//                                     className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                                     value={editEmail}
//                                     onChange={(e) => setEditEmail(e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
//                                     onClick={handleCloseModal}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//                                     onClick={handleSaveEdit}
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default JobFitUserTable;


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
        { id: 1, name: 'Ethan Harper', email: 'ethan.harper@email.com', role: 'Recruiter', status: 'Active', lastActive: '2023-11-15' },
        { id: 2, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', role: 'Recruiter', status: 'Active', lastActive: '2023-11-14' },
        { id: 3, name: 'Noah Carter', email: 'noah.carter@email.com', role: 'Candidate', status: 'Inactive', lastActive: '2023-11-13' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
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
        if (type === 'Status') setFilterStatus(value);
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

        if (filterStatus !== 'All') {
            filteredUsers = filteredUsers.filter((user) => user.status === filterStatus);
        }

        if (sortConfig.key) {
            filteredUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filteredUsers;
    }, [users, searchTerm, filterRole, filterStatus, sortConfig]);

    const statusColors = {
        Active: { bg: '#E6F4EA', color: '#2E7D32' },
        Inactive: { bg: '#FFE4E6', color: '#DC2626' },
    };

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
                            'Status',
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
                                        bgcolor: statusColors[user.status].bg,
                                        color: statusColors[user.status].color,
                                        fontWeight: 500,
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                    }}
                                >
                                    {user.status}
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
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Status:{' '}
                            <Box
                                component="span"
                                sx={{
                                    display: 'inline-flex',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: '6px',
                                    bgcolor: statusColors[user.status].bg,
                                    color: statusColors[user.status].color,
                                    fontWeight: 500,
                                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                }}
                            >
                                {user.status}
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
                                    { label: 'Status', options: ['All', 'Active', 'Inactive'] },
                                ].map(({ label, options }) => (
                                    <FormControl key={label} sx={{ minWidth: { xs: '100%', sm: 120, md: 150 } }}>
                                        <InputLabel sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                            color: '#6B46C1',
                                        }}>
                                            {label}
                                        </InputLabel>
                                        <Select
                                            value={label === 'Role' ? filterRole : filterStatus}
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