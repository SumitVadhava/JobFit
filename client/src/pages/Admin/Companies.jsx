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
//     <header className="sticky top-0 z-10 flex justify-center whitespace-nowrap  px-4 sm:px-10 py-4 bg-white">
//       <label className="flex w-full max-w-[600px] h-12">
//         <div className="flex w-full items-center rounded-xl bg-white border border-[#dbe1e6] shadow-md hover:shadow-lg transition-shadow duration-300">
//           <div className="text-[#60768a] flex items-center justify-center pl-4 pr-2">
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
//             placeholder="Search companies..."
//             className="w-full rounded-r-xl bg-transparent text-[#111518] px-3 py-2 text-base placeholder:text-[#60768a] focus:outline-none focus:ring-2 focus:ring-[#0c7ff2] focus:border-transparent transition-all duration-200"
//             onChange={(e) => onSearch(e.target.value)}
//           />
//         </div>
//       </label>
//     </header>
//   );
// };

// const FilterButtons = ({ onIndustryFilter, onLocationFilter }) => {
//   const [industryOpen, setIndustryOpen] = useState(false);
//   const [locationOpen, setLocationOpen] = useState(false);

//   const industries = ['All', 'Technology', 'Finance', 'Creative', 'Consulting'];
//   const locations = ['All', 'New York', 'London', 'San Francisco', 'Remote'];

//   return (
//     <div className="flex gap-3 p-3 flex-wrap pr-4">
//       <div className="relative">
//         <button
//           className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f0f2f5] pl-4 pr-2"
//           onClick={() => setIndustryOpen(!industryOpen)}
//         >
//           <p className="text-[#111518] text-sm font-medium leading-normal">Industry</p>
//           <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
//             <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
//           </svg>
//         </button>
//         {industryOpen && (
//           <div className="absolute z-10 mt-2 w-40 bg-white border border-[#dbe1e6] rounded-lg shadow-lg">
//             {industries.map((industry) => (
//               <button
//                 key={industry}
//                 className="block w-full text-left px-4 py-2 text-sm text-[#111518] hover:bg-[#f0f2f5]"
//                 onClick={() => {
//                   onIndustryFilter(industry === 'All' ? '' : industry);
//                   setIndustryOpen(false);
//                 }}
//               >
//                 {industry}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className="relative">
//         <button
//           className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f0f2f5] pl-4 pr-2"
//           onClick={() => setLocationOpen(!locationOpen)}
//         >
//           <p className="text-[#111518] text-sm font-medium leading-normal">Location</p>
//           <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
//             <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
//           </svg>
//         </button>
//         {locationOpen && (
//           <div className="absolute z-10 mt-2 w-40 bg-white border border-[#dbe1e6] rounded-lg shadow-lg">
//             {locations.map((location) => (
//               <button
//                 key={location}
//                 className="block w-full text-left px-4 py-2 text-sm text-[#111518] hover:bg-[#f0f2f5]"
//                 onClick={() => {
//                   onLocationFilter(location === 'All' ? '' : location);
//                   setLocationOpen(false);
//                 }}
//               >
//                 {location}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const CompanyTable = ({ companies, onView }) => (
//   <div className="px-4 py-3 @container">
//     <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
//       <table className="flex-1 hidden md:table">
//         <thead>
//           <tr className="bg-white">
//             <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
//               Company Name
//             </th>
//             <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
//               Contact
//             </th>
//             <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
//               Jobs Posted
//             </th>
//             <th className="px-4 py-3 text-left text-[#111518] w-60 text-[#60768a] text-sm font-medium leading-normal">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {companies.map((company, index) => (
//             <tr key={index} className="border-t border-t-[#dbe1e6]">
//               <td className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
//                 {company.name}
//               </td>
//               <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
//                 {company.contact}
//               </td>
//               <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
//                 {company.jobsPosted}
//               </td>
//               <td className="h-[72px] px-4 py-2 w-60 text-[#60768a] text-sm font-bold leading-normal tracking-[0.015em]">
//                 <button
//                   onClick={() => onView(company)}
//                   className="text-[#60768a] hover:text-[#0c7ff2] transition-colors"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="md:hidden divide-y divide-[#dbe1e6]">
//         {companies.map((company, index) => (
//           <div key={index} className="p-4 bg-white hover:bg-[#f0f2f5] transition-colors">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm font-medium text-[#111518]">{company.name}</p>
//                 <p className="text-sm text-[#60768a]">{company.contact}</p>
//                 <p className="text-sm text-[#60768a]">Jobs: {company.jobsPosted}</p>
//               </div>
//               <button
//                 onClick={() => onView(company)}
//                 className="text-[#60768a] hover:text-[#0c7ff2] transition-colors"
//                 title="View Details"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20"
//                   height="20"
//                   fill="currentColor"
//                   viewBox="0 0 256 256"
//                 >
//                   <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a16,16,0,1,1,16-16A16,16,0,0,1,112,160Z" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const Companies = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [industryFilter, setIndustryFilter] = useState('');
//   const [locationFilter, setLocationFilter] = useState('');

//   const companies = [
//     { name: 'Tech Innovators Inc.', contact: 'contact@techinnovators.com', jobsPosted: 12, industry: 'Technology', location: 'San Francisco' },
//     { name: 'Global Solutions Ltd.', contact: 'info@globalsolutions.com', jobsPosted: 8, industry: 'Consulting', location: 'London' },
//     { name: 'Creative Minds Co.', contact: 'hello@creativeminds.com', jobsPosted: 5, industry: 'Creative', location: 'New York' },
//     { name: 'Future Dynamics Corp.', contact: 'support@futuredynamics.com', jobsPosted: 15, industry: 'Technology', location: 'Remote' },
//     { name: 'Pioneer Ventures LLC', contact: 'inquiries@pioneerventures.com', jobsPosted: 10, industry: 'Finance', location: 'New York' },
//   ];

//   const handleSearch = (query) => {
//     setSearchQuery(query.toLowerCase());
//   };

//   const handleIndustryFilter = (industry) => {
//     setIndustryFilter(industry);
//   };

//   const handleLocationFilter = (location) => {
//     setLocationFilter(location);
//   };

//   const handleView = (company) => {
//     console.log(`Viewing company: ${company.name} (${company.contact}, Jobs: ${company.jobsPosted}, Industry: ${company.industry}, Location: ${company.location})`);
//   };

//   const filteredCompanies = companies.filter(
//     (company) =>
//       (company.name.toLowerCase().includes(searchQuery) || company.contact.toLowerCase().includes(searchQuery)) &&
//       (industryFilter === '' || company.industry === industryFilter) &&
//       (locationFilter === '' || company.location === locationFilter)
//   );

//   return (
//     <ErrorBoundary>
//       <div
//         className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
//         style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
//       >
//         <div className="layout-container flex h-full grow flex-col">
//           <Header onSearch={handleSearch} />
//           <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
//             <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
//               <div className="flex flex-wrap justify-between gap-3 p-4">
//                 <div className="flex min-w-[200px] sm:min-w-72 flex-col gap-3">
//                   <p className="text-[#111518] tracking-tight text-2xl sm:text-[32px] font-bold leading-tight">
//                     Companies
//                   </p>
//                   <p className="text-[#60768a] text-sm font-normal leading-normal">Manage companies and their job postings</p>
//                 </div>
//               </div>
//               <FilterButtons onIndustryFilter={handleIndustryFilter} onLocationFilter={handleLocationFilter} />
//               <CompanyTable companies={filteredCompanies} onView={handleView} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default Companies;


import React, { useState } from 'react';
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
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const errorHandler = (event) => {
      setHasError(true);
      setError(event.error || new Error('Unknown error occurred'));
      console.error('ErrorBoundary caught:', event.error);
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

const FilterButtons = ({ onIndustryFilter, onLocationFilter, industryFilter, locationFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const industries = ['All', 'Technology', 'Finance', 'Creative', 'Consulting'];
  const locations = ['All', 'New York', 'London', 'San Francisco', 'Remote'];

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 2 },
        p: 3,
        justifyContent: 'center',
        maxWidth: { xs: '95%', sm: '90%', md: '1000px' },
        mx: 'auto',
      }}
    >
      <FormControl sx={{ minWidth: { xs: '100%', sm: 120, md: 150 } }}>
        <Box sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, color: '#6B46C1' }}>
          Industry
        </Box>
        <Select
          value={industryFilter || 'All'}
          onChange={(e) => onIndustryFilter(e.target.value === 'All' ? '' : e.target.value)}
          size="small"
          sx={{
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E9D5FF' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#A78BFA' },
            '& .MuiSelect-select': { fontSize: { xs: '0.75rem', sm: '0.875rem' } },
          }}
        >
          {industries.map((industry) => (
            <MenuItem key={industry} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: { xs: '100%', sm: 120, md: 150 } }}>
        <Box sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, color: '#6B46C1' }}>
          Location
        </Box>
        <Select
          value={locationFilter || 'All'}
          onChange={(e) => onLocationFilter(e.target.value === 'All' ? '' : e.target.value)}
          size="small"
          sx={{
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E9D5FF' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#A78BFA' },
            '& .MuiSelect-select': { fontSize: { xs: '0.75rem', sm: '0.875rem' } },
          }}
        >
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const CompanyTable = ({ companies }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              'Company Name',
              ...(isMobile ? [] : ['Contact', 'Jobs Posted']),
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
          {companies.map((company, index) => (
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
                {company.name}
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
                    {company.contact}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      color: '#4A4A4A',
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 1, sm: 2, md: 3 },
                    }}
                  >
                    {company.jobsPosted}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {companies.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center', color: '#6B7280', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          No companies found matching the criteria.
        </Box>
      )}
    </TableContainer>
  );

  const renderCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, maxWidth: '95%', mx: 'auto' }}>
      {companies.map((company, index) => (
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
            {company.name}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#4A4A4A',
              }}
            >
              Contact: {company.contact}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#4A4A4A',
              }}
            >
              Jobs Posted: {company.jobsPosted}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#4A4A4A',
              }}
            >
              Industry: {company.industry}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#4A4A4A',
              }}
            >
              Location: {company.location}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {isMobile ? renderCards() : renderTable()}
    </Box>
  );
};

const Companies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const companies = [
    { name: 'Tech Innovators Inc.', contact: 'contact@techinnovators.com', jobsPosted: 12, industry: 'Technology', location: 'San Francisco' },
    { name: 'Global Solutions Ltd.', contact: 'info@globalsolutions.com', jobsPosted: 8, industry: 'Consulting', location: 'London' },
    { name: 'Creative Minds Co.', contact: 'hello@creativeminds.com', jobsPosted: 5, industry: 'Creative', location: 'New York' },
    { name: 'Future Dynamics Corp.', contact: 'support@futuredynamics.com', jobsPosted: 15, industry: 'Technology', location: 'Remote' },
    { name: 'Pioneer Ventures LLC', contact: 'inquiries@pioneerventures.com', jobsPosted: 10, industry: 'Finance', location: 'New York' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleIndustryFilter = (industry) => {
    setIndustryFilter(industry);
  };

  const handleLocationFilter = (location) => {
    setLocationFilter(location);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      (company.name.toLowerCase().includes(searchQuery) || company.contact.toLowerCase().includes(searchQuery)) &&
      (industryFilter === '' || company.industry === industryFilter) &&
      (locationFilter === '' || company.location === locationFilter)
  );

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
          width: '100%',
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
            width: '100%',
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
                  Companies
                </Typography>
                {/* <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    color: '#6B7280',
                  }}
                >
                  Manage companies and their job postings
                </Typography> */}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ maxWidth: { xs: '95%', sm: '90%', md: '1000px' }, mx: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                <TextField
                  placeholder="Search companies..."
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
                <FilterButtons
                  onIndustryFilter={handleIndustryFilter}
                  onLocationFilter={handleLocationFilter}
                  industryFilter={industryFilter}
                  locationFilter={locationFilter}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <CompanyTable companies={filteredCompanies} />
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Companies;