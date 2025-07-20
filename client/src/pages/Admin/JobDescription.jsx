// import React, { useState } from 'react';

// const ErrorBoundary = ({ children }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   React.useEffect(() => {
//     const errorHandler = (error) => {
//       setHasError(true);
//       setError(error);
//     };
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, []);

//   if (hasError) {
//     return <h1 className="text-red-600 text-center p-4">Error: {error?.message || 'Something went wrong.'}</h1>;
//   }
//   return children;
// };

// const Header = ({ onSearch }) => {
//   return (
//     <header className="sticky top-0 z-10 flex justify-center whitespace-nowrap px-4 sm:px-10 py-4 bg-slate-50">
//       <label className="flex w-full max-w-[600px] h-12">
//         <div className="flex w-full items-center rounded-xl bg-white border border-[#cedbe8] shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="text-[#49739c] flex items-center justify-center pl-4 pr-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="28px"
//               height="28px"
//               fill="currentColor"
//               viewBox="0 0 256 256"
//               className="transform hover:scale-110 transition-transform duration-200"
//             >
//               <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
//             </svg>
//           </div>
//           <input
//             placeholder="Search jobs or companies..."
//             className="w-full rounded-r-xl bg-transparent text-[#0d141c] px-3 py-2 text-base placeholder:text-[#6b829a] focus:outline-none focus:ring-2 focus:ring-[#0c7ff2] focus:border-transparent transition-all duration-200"
//             onChange={(e) => onSearch(e.target.value)}
//           />
//         </div>
//       </label>
//     </header>
//   );
// };

// const JobTable = ({ jobs, onView }) => {
//   return (
//     <div className="px-4 py-3">
//       <div className="overflow-x-auto rounded-lg border border-[#cedbe8] bg-white">
//         <table className="w-full hidden md:table">
//           <thead>
//             <tr className="bg-white text-left text-sm font-medium text-[#0d141c]">
//               <th className="px-4 py-3 w-[200px] sm:w-[300px] md:w-[400px] job-table-column-120">Job Title</th>
//               <th className="px-4 py-3 w-[200px] sm:w-[300px] md:w-[400px] job-table-column-240">Company</th>
//               <th className="px-4 py-3 w-[150px] sm:w-[200px] md:w-[400px] job-table-column-360">Submitted Date</th>
//               <th className="px-4 py-3 w-[100px] sm:w-60 job-table-column-480">Status</th>
//               <th className="px-4 py-3 w-[80px] sm:w-60 job-table-column-600 text-[#49739c]">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((job, index) => (
//               <tr
//                 key={index}
//                 className={`border-t border-[#cedbe8] hover:bg-slate-100 transition-colors ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
//               >
//                 <td className="px-4 py-2 text-sm text-[#0d141c] job-table-column-120">{job.title}</td>
//                 <td className="px-4 py-2 text-sm text-[#49739c] job-table-column-240">{job.company}</td>
//                 <td className="px-4 py-2 text-sm text-[#49739c] job-table-column 360">{job.date}</td>
//                 <td className="px-4 py-2 text-sm job-table-column-480">
//                   <button
//                     className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
//                       job.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
//                     }`}
//                   >
//                     {job.status}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 job-table-column-600">
//                   <button
//                     onClick={() => onView(job)}
//                     className="text-[#49739c] hover:text-[#0c7ff2] transition-colors"
//                     title="View Details"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="20"
//                       height="20"
//                       fill="currentColor"
//                       viewBox="0 0 256 256"
//                     >
//                       <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a16,16,0,1,1,16-16A16,16,0,0,1,112,160Z" />
//                     </svg>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="md:hidden divide-y divide-[#cedbe8]">
//           {jobs.map((job, index) => (
//             <div key={index} className="p-4 bg-white hover:bg-slate-100 transition-colors fade-in">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-[#0d141c]">{job.title}</p>
//                   <p className="text-sm text-[#49739c]">{job.company}</p>
//                   <p className="text-sm text-[#49739c]">{job.date}</p>
//                 </div>
//                 <button
//                   onClick={() => onView(job)}
//                   className="text-[#49739c] hover:text-[#0c7ff2] transition-colors"
//                   title="View Details"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                     fill="currentColor"
//                     viewBox="0 0 256 256"
//                   >
//                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a16,16,0,1,1,16-16A16,16,0,0,1,112,160Z" />
//                   </svg>
//                 </button>
//               </div>
//               <button
//                 className={`mt-2 px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
//                   job.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
//                 }`}
//               >
//                 {job.status}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const JobDescriptions = () => {
//   const [activeTab, setActiveTab] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');

//   const jobs = [
//     { title: 'Software Engineer', company: 'Tech Innovators Inc.', date: '2024-07-26', status: 'Pending Review' },
//     { title: 'Product Manager', company: 'Global Solutions Ltd.', date: '2024-07-25', status: 'Reviewed' },
//     { title: 'Data Analyst', company: 'Data Driven Corp.', date: '2024-07-24', status: 'Pending Review' },
//     { title: 'UX Designer', company: 'Creative Minds Agency', date: '2024-07-23', status: 'Reviewed' },
//     { title: 'Marketing Specialist', company: 'Marketing Masters LLC', date: '2024-07-22', status: 'Pending Review' },
//     { title: 'Sales Representative', company: 'Sales Success Group', date: '2024-07-21', status: 'Reviewed' },
//     { title: 'Customer Support Agent', company: 'Support Solutions Co.', date: '2024-07-20', status: 'Pending Review' },
//     { title: 'Financial Analyst', company: 'Finance First Inc.', date: '2024-07-19', status: 'Reviewed' },
//     { title: 'HR Manager', company: 'People Power Corp.', date: '2024-07-18', status: 'Pending Review' },
//     { title: 'Operations Manager', company: 'Operational Excellence Ltd.', date: '2024-07-17', status: 'Reviewed' },
//   ];

//   const handleSearch = (query) => {
//     setSearchQuery(query.toLowerCase());
//   };

//   const handleView = (job) => {
//     console.log(`Viewing job: ${job.title} at ${job.company} (Status: ${job.status}, Date: ${job.date})`);
//   };

//   const filteredJobs = jobs.filter((job) => {
//     const matchesTab = activeTab === 'All' || job.status === activeTab;
//     const matchesSearch =
//       job.title.toLowerCase().includes(searchQuery) || job.company.toLowerCase().includes(searchQuery);
//     return matchesTab && matchesSearch;
//   });

//   return (
//     <ErrorBoundary>
//       <div
//         className="relative flex min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
//         style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
//       >
//         <div className="layout-container flex h-full grow flex-col">
//           <Header onSearch={handleSearch} />
//           <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
//             <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
//               <div className="flex flex-wrap justify-between gap-3 p-4">
//                 <div className="flex min-w-[200px] sm:min-w-72 flex-col gap-3">
//                   <p className="text-2xl sm:text-[32px] font-bold leading-tight text-[#0d141c] fade-in">
//                     Job Descriptions
//                   </p>
//                   <p className="text-sm text-[#49739c] fade-in">Manage and review submitted job descriptions.</p>
//                 </div>
//               </div>
//               <div className="pb-3">
//                 <div className="flex border-b border-[#cedbe8] px-4 gap-4 sm:gap-8">
//                   {['All', 'Pending Review', 'Reviewed'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => setActiveTab(status)}
//                       className={`flex flex-col items-center justify-center pb-[13px] pt-4 text-sm font-bold tracking-[0.015em] transition-colors fade-in ${
//                         activeTab === status
//                           ? 'text-[#0d141c] border-b-[3px] border-[#0c7ff2]'
//                           : 'text-[#49739c] border-b-[3px] border-transparent hover:text-[#0c7ff2]'
//                       }`}
//                     >
//                       {status}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <JobTable jobs={filteredJobs} onView={handleView} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default JobDescriptions;


import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const errorHandler = (error) => {
      setHasError(true);
      setError(error);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
        <Typography
          variant="h6"
          sx={{
            color: '#DC2626',
            textAlign: 'center',
            p: 4,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
          }}
        >
          Error: {error?.message || 'Something went wrong.'}
        </Typography>
      </Box>
    );
  }
  return children;
};

const JobTable = ({ jobs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const statusColors = {
    'Pending Review': { bg: '#FEF3C7', color: '#D97706' },
    Reviewed: { bg: '#E6F4EA', color: '#2E7D32' },
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
              'Job Title',
              ...(isMobile ? [] : ['Company', 'Submitted Date']),
              'Status',
            ].map((head) => (
              <TableCell
                key={head}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  color: '#1A1A1A',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  bgcolor: '#F9FAFB',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job, index) => (
            <TableRow
              key={index}
              sx={{
                '&:hover': {
                  bgcolor: '#F3E8FF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(107, 70, 193, 0.1)',
                },
                transition: 'all 0.3s ease',
                bgcolor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
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
                {job.title}
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
                    {job.company}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      color: '#4A4A4A',
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 1, sm: 2, md: 3 },
                    }}
                  >
                    {job.date}
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
                    bgcolor: statusColors[job.status].bg,
                    color: statusColors[job.status].color,
                    fontWeight: 500,
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  }}
                >
                  {job.status}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {jobs.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center', color: '#6B7280', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          No jobs found matching the criteria.
        </Box>
      )}
    </TableContainer>
  );

  const renderCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, maxWidth: '95%', mx: 'auto' }}>
      {jobs.map((job, index) => (
        <Paper
          key={index}
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
            {job.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#4A4A4A',
              }}
            >
              Company: {job.company}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#4A4A4A',
              }}
            >
              Submitted Date: {job.date}
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
                  bgcolor: statusColors[job.status].bg,
                  color: statusColors[job.status].color,
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                }}
              >
                {job.status}
              </Box>
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isMobile ? renderCards() : renderTable()}
    </Box>
  );
};

const JobDescriptions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    { title: 'Software Engineer', company: 'Tech Innovators Inc.', date: '2024-07-26', status: 'Pending Review' },
    { title: 'Product Manager', company: 'Global Solutions Ltd.', date: '2024-07-25', status: 'Reviewed' },
    { title: 'Data Analyst', company: 'Data Driven Corp.', date: '2024-07-24', status: 'Pending Review' },
    { title: 'UX Designer', company: 'Creative Minds Agency', date: '2024-07-23', status: 'Reviewed' },
    { title: 'Marketing Specialist', company: 'Marketing Masters LLC', date: '2024-07-22', status: 'Pending Review' },
    { title: 'Sales Representative', company: 'Sales Success Group', date: '2024-07-21', status: 'Reviewed' },
    { title: 'Customer Support Agent', company: 'Support Solutions Co.', date: '2024-07-20', status: 'Pending Review' },
    { title: 'Financial Analyst', company: 'Finance First Inc.', date: '2024-07-19', status: 'Reviewed' },
    { title: 'HR Manager', company: 'People Power Corp.', date: '2024-07-18', status: 'Pending Review' },
    { title: 'Operations Manager', company: 'Operational Excellence Ltd.', date: '2024-07-17', status: 'Reviewed' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesTab = activeTab === 'All' || job.status === activeTab;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery) || job.company.toLowerCase().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <ErrorBoundary>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                    color: '#1A1A1A',
                  }}
                >
                  Job Descriptions
                </Typography>
                {/* <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    color: '#6B7280',
                  }}
                >
                  Manage and review submitted job descriptions.
                </Typography> */}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ maxWidth: { xs: '95%', sm: '90%', md: '1000px' }, mx: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                <TextField
                  placeholder="Search jobs or companies..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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
                <Box sx={{ display: 'flex', borderBottom: '2px solid #E9D5FF', px: 4, gap: { xs: 2, sm: 4, md: 6 }, mb: 3 }}>
                  {['All', 'Pending Review', 'Reviewed'].map((status) => (
                    <Button
                      key={status}
                      onClick={() => setActiveTab(status)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        color: activeTab === status ? '#1A1A1A' : '#6B7280',
                        borderBottom: activeTab === status ? '3px solid #6B46C1' : '3px solid transparent',
                        borderRadius: 0,
                        pb: 1.5,
                        pt: 1,
                        '&:hover': {
                          color: '#6B46C1',
                          borderBottom: '3px solid #A78BFA',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {status}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <JobTable jobs={filteredJobs} />
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </ErrorBoundary>
  );
};

export default JobDescriptions;