import React, { useState } from 'react'
import RoleSelector from './RoleSelector'
import AuthForm from './AuthForm';

const AuthPage = ({ userData, setUserData, isLogin }) => {
    // 'login' = show login form, 'role' = show role selection, 'signup' = show signup form
    const [step, setStep] = useState('login');
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep('signup');
    };

    const handleSwitchToSignup = () => {
        setStep('role');
    };

    const handleSwitchToLogin = () => {
        setStep('login');
        setSelectedRole(null);
    };

    const handleBack = () => {
        if (step === 'signup') {
            setStep('role');
        } else if (step === 'role') {
            setStep('login');
            setSelectedRole(null);
        }
    };

    return (
        <div className='max-w-7xl mx-auto h-[86vh]'>
            {step !== 'login' && (
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

            {step === 'login' && (
                <AuthForm
                    role="candidate"
                    setUserData={setUserData}
                    forceLogin={true}
                    onSwitchToSignup={handleSwitchToSignup}
                />
            )}

            {step === 'role' && <RoleSelector onSelect={handleRoleSelect} />}

            {step === 'signup' && (
                <AuthForm
                    role={selectedRole}
                    setUserData={setUserData}
                    forceLogin={false}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </div>
    )
}

export default AuthPage
