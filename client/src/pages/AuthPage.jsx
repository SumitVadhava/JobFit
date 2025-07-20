import React, { useState } from 'react'
import RoleSelector from './RoleSelector'
import ModeSelector from './ModeSelector';
import AuthForm from './AuthForm';

const AuthPage = ({ userData, setUserData, isLogin }) => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null);
    // const [mode, setMode] = useState(null);

    const handleRoleSelect = (selectedRole) => {
        setSelectedRole(selectedRole); // e.g., 'recruiter'
        setStep(2);
    };

    // const handleModeSelect = (selectedMode) => {
    //     setMode(selectedMode); // 'login' or 'register'
    //     setStep(3);
    // };

    const handleBack = () => {
        if (step === 2) {
            setStep(1); // Go back to role selection
        } else if (step === 1) {
            setSelectedRole(null);
            setStep(1); // Go back to role selection
        }
    };

    return (
        <div className='max-w-7xl mx-auto h-[86vh]'>
            {step > 1 && (
                <button
                    onClick={handleBack}
                    className="relative top-4 left-4 flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 aria-label='Go back to previous page"
                    style={{ fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif" }}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>
            )}

            {step === 1 && <RoleSelector onSelect={handleRoleSelect} />}
            {/* {step === 2 && <ModeSelector onSelect={handleModeSelect} />} */}
            {step === 2 && (
                <>
                    {selectedRole === 'recruiter' && <AuthForm role={selectedRole} setUserData={setUserData}  />}
                    {selectedRole === 'candidate' && <AuthForm role={selectedRole} setUserData={setUserData}  />}
                    {selectedRole === 'admin' && <AuthForm role={selectedRole} setUserData={setUserData}  />}
                </>
            )}
        </div>
    )
}

export default AuthPage
