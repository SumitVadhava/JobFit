import React from 'react'

function ModeSelector({ onSelect }) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Already registered?</h2>
            <p className="mb-6 text-gray-600">Choose an option to continue:</p>

            <div className="flex justify-center gap-6">
                <button
                    onClick={() => onSelect('login')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                    Login
                </button>

                <button
                    onClick={() => onSelect('register')}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                    Register
                </button>
            </div>
        </div>
    );
}


export default ModeSelector