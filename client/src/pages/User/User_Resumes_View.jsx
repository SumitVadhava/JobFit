import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    return <h1 className="text-red-600 text-center p-4">Error: {error?.message || 'Something went wrong.'}</h1>;
  }
  return children;
};

const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-in-out ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
  >
    {message}
    <button className="ml-4 text-white" onClick={onClose}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
      </svg>
    </button>
  </div>
);

const FeedbackModal = ({ resume, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#111418]">Feedback for {resume.name}</h3>
        <button onClick={onClose} className="text-[#60758a] hover:text-[#0c7ff2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
          </svg>
        </button>
      </div>
      <p className="text-[#60758a] text-sm">
        ATS Score: {resume.atsScore} / 100
      </p>
      <p className="text-[#60758a] text-sm mt-2">
        Feedback: Your resume is well-structured but could benefit from more specific keywords related to {resume.name.split(' ')[0].toLowerCase()} roles. Consider adding quantifiable achievements and optimizing for ATS compatibility.
      </p>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#0c7ff2] text-white rounded-lg hover:bg-[#0a6cd6] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const Header = ({ isMenuOpen, setIsMenuOpen, onSearch }) => (
  <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-[#f0f2f5] px-4 sm:px-10 py-3 bg-white shadow-sm">
    <div className="flex items-center gap-4 sm:gap-8">
      <div className="flex items-center gap-2 sm:gap-4 text-[#111418]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-[-0.015em] text-[#111418]">JobFit Pro</h2>
      </div>
      <nav className="hidden sm:flex items-center gap-9">
        {['Dashboard', 'My Resumes', 'Resources', 'Help'].map((item) => (
          <a key={item} href="#" className="text-sm font-medium text-[#111418] hover:text-[#0c7ff2] transition-colors">
            {item}
          </a>
        ))}
      </nav>
      <button className="sm:hidden text-[#111418]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
    <div className="flex items-center gap-2 sm:gap-8">
      <label className="hidden sm:flex min-w-[120px] sm:min-w-40 h-10 max-w-64">
        <div className="flex w-full items-stretch rounded-lg h-full">
          <div className="text-[#60758a] flex bg-[#f0f2f5] items-center justify-center pl-4 rounded-l-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
          <input
            placeholder="Search resumes"
            className="form-input w-full rounded-r-lg bg-[#f0f2f5] text-[#111418] px-4 text-base placeholder:text-[#60758a] focus:outline-none focus:ring-0"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </label>
      <button className="hidden sm:flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f5] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
          />
        </svg>
      </button>
      <div
        className="bg-center bg-no-repeat bg-cover rounded-full size-8 sm:size-10"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMhCSnn8RKJOjk3qZNo9Z4F0p7EAfyLQdWcuPfI7oYSxV6GFK7--DqG8jDhbVN7UxUlYpOzeHsl0LSIySJI-fVi2A8YIxAJfSkX-OhdzRRAVSPzQ7b_4sPB8diuL-TMyyoJusQsNMrlPw-xgTbHOCX6UeuVc36lM2m4iK-0timTq9eE9p8Cb2p4wgZs7yJVvnT0RgjLp-7ryb4MNaAYfvJS71THOtfrUcgg_71Yla9f_-1EANa1YxmGRQrOnb6n9yqIyqaoSaf0fw')",
        }}
      />
    </div>
    {isMenuOpen && (
      <div className="sm:hidden absolute top-16 left-0 w-full bg-white border-b border-[#f0f2f5] shadow-lg">
        <nav className="flex flex-col p-4 gap-4">
          {['Dashboard', 'My Resumes', 'Resources', 'Help'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[#111418] hover:text-[#0c7ff2] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#60758a] flex border-none bg-[#f0f2f5] items-center justify-center pl-4 rounded-l-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                placeholder="Search resumes"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-full placeholder:text-[#60758a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </label>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f5] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
              />
            </svg>
          </button>
        </nav>
      </div>
    )}
  </header>
);

const UploadSection = ({ onFileUpload, file, setFile }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile); // set file state
      onFileUpload(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]); // set file state
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div
        className={`flex flex-col items-center gap-6 rounded-lg border-2 border-dashed ${isDragging ? 'border-[#0c7ff2] bg-[#e6f0ff]' : 'border-[#dbe0e6] bg-white'
          } px-6 py-14 transition-colors duration-200`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
            Drag and drop your resume here
          </p>
          <p className="text-[#60758a] text-sm font-normal leading-normal max-w-[480px] text-center">
            Or, browse files from your computer (PDF, DOC, DOCX)
          </p>
        </div>
        <button
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0a6cd6] transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          <span className="truncate">Select File</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          name='pdf'
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

const ResumeTable = ({ resumes, onViewFeedback, onDelete, onSort }) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  return (
    <div className="px-4 py-3 @container">
      <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
        {/* Table for larger screens */}
        <table className="flex-1 hidden md:table">
          <thead>
            <tr className="bg-white">
              {[
                { label: 'Resume Name', field: 'name' },
                { label: 'Upload Date', field: 'uploadDate' },
                // { label: 'Version', field: 'version' },
                // { label: 'ATS Score', field: 'atsScore' }, 
                { label: 'Actions', field: '' },
              ].map(({ label, field }) => (
                <th
                  key={label}
                  className={`px-4 py-3 text-left text-[#111418] ${field ? 'w-[400px]' : 'w-60'
                    } text-sm font-medium leading-normal ${field ? 'cursor-pointer hover:text-[#0c7ff2]' : ''}`}
                  onClick={field ? () => handleSort(field) : undefined}
                  aria-sort={sortField === field ? sortDirection : 'none'}
                >
                  {label}
                  {/* {sortField === field && (
                    <svg
                      className="inline-block w-4 h-4 ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d={
                          sortDirection === 'asc'
                            ? 'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'
                            : 'M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z'
                        }
                      />
                    </svg>
                  )} */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume, index) => (
              <tr key={index} className="border-t border-t-[#dbe0e6] hover:bg-[#f0f2f5] transition-colors">
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                  {resume.name}
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                  {resume.uploadDate}
                </td>
                {/* <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                  {resume.version}
                </td> */}
                {/* <td className="h-[72px] px-4 py-2 max-w-[400px] text-sm font-normal leading-normal">
                  <div className="flex items-center gap-3">
                    <div className="w-[88px] overflow-hidden rounded-sm bg-[#dbe0e6]">
                      <div
                        className="h-1 rounded-full bg-[#0c7ff2] transition-all duration-300"
                        style={{ width: `${resume.atsScore}%` }}
                      />
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">{resume.atsScore}</p>
                  </div>
                  <div className='max-w-[80px] flex justify-center items-center'>
                    <button
                      onClick={() => onViewFeedback(resume)}
                      className="text-[#60758a] hover:text-[#0c7ff2] transition-colors"
                      aria-label={`View feedback for ${resume.name}`}
                    >
                      View
                    </button>
                  </div>
                </td> */}
                <td className="h-[72px] px-4 py-2 w-60 text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em]">
                  <div className="">

                    <button
                      onClick={() => onDelete(resume)}
                      className="text-[#60758a] hover:text-red-500 transition-colors"
                      aria-label={`Delete ${resume.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16H56V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V64h16a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm88,168H72V64H184ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Card layout for mobile */}
        <div className="md:hidden divide-y divide-[#dbe0e6]">
          {resumes.map((resume, index) => (
            <div key={index} className="p-4 bg-white hover:bg-[#f0f2f5] transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[#111418]">{resume.name}</p>
                  <p className="text-sm text-[#60758a] mt-1">{resume.uploadDate}</p>
                  <p className="text-sm text-[#60758a] mt-1">Version: {resume.version}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-[88px] overflow-hidden rounded-sm bg-[#dbe0e6]">
                      <div
                        className="h-1 rounded-full bg-[#0c7ff2] transition-all duration-300"
                        style={{ width: `${resume.atsScore}%` }}
                      />
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">{resume.atsScore}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewFeedback(resume)}
                    className="text-[#60758a] hover:text-[#0c7ff2] transition-colors"
                    aria-label={`View feedback for ${resume.name}`}
                    title="View Feedback"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a16,16,0,1,1,16-16A16,16,0,0,1,112,160Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(resume)}
                    className="text-[#60758a] hover:text-red-500 transition-colors"
                    aria-label={`Delete ${resume.name}`}
                    title="Delete Resume"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16H56V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V64h16a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm88,168H72V64H184ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// main
const Resumes = ({ atsData, setAtsData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null)
  const [resumes, setResumes] = useState([]);
  const [description, setDescription] = useState('');
  const textareaRef = useRef(null);
  // const [selectedResume, setSelectedResume] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (selectedFile) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(selectedFile.type)) {
      showToast('Invalid file type. Please upload PDF, DOC, or DOCX.', 'error');
      return;
    }
    if (selectedFile.size > maxSize) {
      showToast('File size exceeds 5MB limit.', 'error');
      return;
    }
    const newResume = {
      name: selectedFile.name,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      version: 'v1.0',
      atsScore: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    };
    setResumes([newResume, ...resumes]);
    setFile(selectedFile);
  };

  const handleViewFeedback = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('jobDesc', description);

      const response = await axios.post('https://jobfit-s5v7.onrender.com/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Make sure response.data exists and has the expected structure
      if (response.data && response.data.analysis) {
        setAtsData(response.data);
        navigate('/user/ats');
      } else {
        showToast('Invalid response from server', 'error');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      showToast('Failed to analyze resume', 'error');
    }
  };

  const handleDelete = (resume) => {
    setResumes(resumes.filter((r) => r.name !== resume.name));
    showToast(`Resume "${resume.name}" deleted successfully!`, 'success');
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSort = (field, direction) => {
    const sortedResumes = [...resumes].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (field === 'atsScore') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    setResumes(sortedResumes);
  };



  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [description]);

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    setLoading(true);

    if (!file) {
      alert('Please select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('jobDesc', description);

      console.log("Sending request with:", { file, description }); // Debug log

      const response = await axios.post('https://jobfit-s5v7.onrender.com/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Received response:", response.data); // Debug log

      if (response.data) {
        setAtsData(response.data);
        setResumes([...resumes, {
          name: file.name,
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          atsScore: response.data.analysis?.result?.ATSScore || 0
        }]);
        setFile(null);
        showToast(`Resume "${file.name}" uploaded successfully!`, 'success');
        navigate('/user/ats');
      } else {
        showToast('Invalid response from server', 'error');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      showToast('Failed to analyze resume', 'error');
    }
    finally {
      setLoading(false);
    }
  }

  const filteredResumes = resumes.filter((resume) => resume.name.toLowerCase().includes(searchQuery));

  return (
    <ErrorBoundary>
      <div
        className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4 bg-white">
                <p className="text-[#111418] tracking-tight text-2xl sm:text-[32px] font-bold leading-tight min-w-[200px] sm:min-w-72">
                  My Resumes
                </p>
                {/* <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#0c7ff2] text-white text-sm font-medium leading-normal hover:bg-[#0a6cd6] transition-colors"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <span className="truncate">Upload Resume</span>
                </button> */}
                <input
                  id="file-upload"
                  type="file"
                  name='pdf'
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    e.target.files.length;
                    handleFileChange(e);
                  }}
                />
              </div>
              <UploadSection onFileUpload={handleFileUpload} file={file} setFile={setFile} />
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Uploaded Resumes
              </h2>
              <ResumeTable
                resumes={filteredResumes}
                onViewFeedback={handleViewFeedback}
                onDelete={handleDelete}
                onSort={handleSort}
              />
              <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Description
              </h2>
              <div className="w-full max-w-2xl p-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={description}
                    onChange={handleChange}
                    placeholder="Enter your description..."
                    maxLength={2000}
                    className="w-full p-4 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                  />
                  <div className="absolute bottom-12 right-2 text-sm text-gray-500">
                    {description.length}/2000
                  </div>
                  <button
                    className="bg-[#0c7ff2] text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUpload}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                          ></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      "Save and Analyze"
                    )}
                  </button>
                </div>
              </div>


            </div>
          </div>
          {/* {selectedResume && <FeedbackModal resume={selectedResume} onClose={() => setSelectedResume(null)} />} */}
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      </div>
      <style>
        {`
          @keyframes slide-in-out {
            0% { transform: translateY(100px); opacity: 0; }
            10% { transform: translateY(0); opacity: 1; }
            90% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100px); opacity: 0; }
          }
          .animate-slide-in-out {
            animation: slide-in-out 3s ease-in-out;
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-in;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default Resumes;