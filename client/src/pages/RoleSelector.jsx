import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserTie } from 'react-icons/fa';
import { FaUserCog } from 'react-icons/fa';

const RoleSelector = ({ onSelect }) => {
  const [selectedRole, setSelectedRole] = useState('candidate');

  const roles = [
    { name: 'candidate', icon: <FaUser /> },
    { name: 'recruiter', icon: <FaUserTie /> },
    { name: 'admin', icon: <FaUserCog /> },
  ];

  return (
      <div className="flex flex-col items-center justify-center h-[86vh] bg-white">
        <h2 className="text-2xl font-semibold text-purple-700 mb-8">What's your role?</h2>
        <div className="flex space-x-6">
          {roles.map((role) => (
            <motion.div
              key={role.name}
              className={`w-40 h-40 flex flex-col items-center justify-center rounded-lg border-2 ${selectedRole === role.name ? 'border-purple-500 bg-purple-100' : 'border-gray-300 bg-white'
                } cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedRole(role.name)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl mb-4 text-purple-600">{role.icon}</div>
              <p className="text-lg font-medium text-gray-800">{role.name}</p>
              {/* {selectedRole === role.name && (
              <motion.div
                className="absolute w-4 h-4 bg-purple-500 rounded-full mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              />
            )} */}
            </motion.div>
          ))}
        </div>
        <motion.button
          className="mt-10 px-6 py-3 bg-purple-600 text-white rounded-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(selectedRole)}
        >
          Next
        </motion.button>
      </div>
  );
};

export default RoleSelector;