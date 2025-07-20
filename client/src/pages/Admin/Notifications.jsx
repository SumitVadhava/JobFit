import React, { useState } from 'react';

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

const NotificationModal = ({ notification, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-[#101518] text-lg font-bold mb-4">Notification Details</h3>
        <p className="text-[#5c748a] text-sm mb-2"><strong>Message:</strong> {notification.message}</p>
        <p className="text-[#5c748a] text-sm mb-2"><strong>Date:</strong> {notification.date}</p>
        <p className="text-[#5c748a] text-sm mb-4"><strong>Status:</strong> {notification.status}</p>
        <button
          className="flex w-full items-center justify-center rounded-xl h-10 bg-[#0c7ff2] text-white text-sm font-medium"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const FilterButtons = ({ onFilterChange, activeFilter }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const filters = ['All', 'Unread', 'Read', 'Archived'];

  return (
    <div className="flex gap-3 p-3 flex-wrap">
      <div className="relative">
        <button
          className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#eaedf1] pl-4 pr-2 text-[#101518] text-sm font-medium"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <span>{activeFilter || 'Filter'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </button>
        {filterOpen && (
          <div className="absolute z-10 mt-2 w-40 bg-gray-50 border border-[#d4dce2] rounded-lg shadow-lg">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`block w-full text-left px-4 py-2 text-sm text-[#101518] hover:bg-[#eaedf1] ${
                  activeFilter === filter ? 'bg-[#d4dce2]' : ''
                }`}
                onClick={() => {
                  onFilterChange(filter === 'All' ? '' : filter);
                  setFilterOpen(false);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationTable = ({ notifications, onStatusChange, onView }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Unread':
        return 'bg-blue-100 text-blue-800';
      case 'Read':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-2 sm:px-4 py-3">
      <div className="flex overflow-hidden rounded-xl border border-[#d4dce2] bg-gray-50">
        {/* Table for larger screens */}
        <table className="flex-1 hidden md:table">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-[#101518] w-[40%] text-sm font-medium leading-normal">
                Notification
              </th>
              <th className="px-4 py-3 text-left text-[#101518] w-[30%] text-sm font-medium leading-normal">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[#101518] w-[30%] text-sm font-medium leading-normal">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index} className="border-t border-[#d4dce2]">
                <td
                  className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal cursor-pointer hover:text-[#0c7ff2]"
                  onClick={() => onView(notification)}
                >
                  {notification.message}
                </td>
                <td className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal">
                  {notification.date}
                </td>
                <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                  <select
                    value={notification.status}
                    onChange={(e) => onStatusChange(notification, e.target.value)}
                    className={`w-full rounded-xl h-8 px-4 text-sm font-medium ${getStatusStyles(notification.status)}`}
                  >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                    <option value="Archived">Archived</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Card layout for mobile */}
        <div className="md:hidden divide-y divide-[#d4dce2]">
          {notifications.map((notification, index) => (
            <div key={index} className="p-4 bg-gray-50 hover:bg-[#eaedf1] transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className="text-sm font-medium text-[#5c748a] cursor-pointer hover:text-[#0c7ff2] mb-2"
                    onClick={() => onView(notification)}
                  >
                    {notification.message}
                  </p>
                  <p className="text-sm text-[#5c748a]">{notification.date}</p>
                </div>
              </div>
              <select
                value={notification.status}
                onChange={(e) => onStatusChange(notification, e.target.value)}
                className={`mt-2 w-full rounded-xl h-8 px-4 text-sm font-medium ${getStatusStyles(notification.status)}`}
              >
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [filter, setFilter] = useState('');
  const [notifications, setNotifications] = useState([
    { message: 'New candidate applied for Software Engineer position', date: '2024-03-15', status: 'Unread' },
    { message: 'Your job posting for Data Analyst has been approved', date: '2024-03-14', status: 'Read' },
    { message: 'Candidate Sarah Lee viewed your company profile', date: '2024-03-12', status: 'Read' },
    { message: 'System maintenance scheduled for this weekend', date: '2024-03-10', status: 'Read' },
    { message: 'Job application deadline approaching for Marketing Manager', date: '2024-03-08', status: 'Read' },
  ]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleStatusChange = (notification, newStatus) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.message === notification.message && n.date === notification.date ? { ...n, status: newStatus } : n
      )
    );
    console.log(`Notification "${notification.message}" status changed to: ${newStatus}`);
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const filteredNotifications = notifications.filter(
    (notification) => filter === '' || notification.status === filter
  );

  return (
    <ErrorBoundary>
      <div
        className="relative flex min-h-screen flex-col bg-gray-50 overflow-x-hidden"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 flex flex-1 justify-center py-5">
            <div className="flex flex-col max-w-[960px] w-full">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-[200px] flex-col gap-3">
                  <h1 className="text-[#101518] tracking-tight text-2xl sm:text-[32px] font-bold leading-tight">
                    Notifications
                  </h1>
                  <p className="text-[#5c748a] text-sm font-normal leading-normal">
                    Stay updated on your account activity and important alerts.
                  </p>
                </div>
              </div>
              <FilterButtons onFilterChange={handleFilterChange} activeFilter={filter} />
              <NotificationTable
                notifications={filteredNotifications}
                onStatusChange={handleStatusChange}
                onView={handleView}
              />
              <NotificationModal
                notification={selectedNotification}
                isOpen={isModalOpen}
                onClose={closeModal}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Notifications;