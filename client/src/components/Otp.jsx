import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

const OTPDemo = ({
    isOpen = false,
    onClose,
    onComplete,
    onCompleteOtp,
    length = 6,
    onResend,
    timeLimit = 60,
    disabled = false,
    title = "Enter OTP",
    subtitle = "We've sent a {length}-digit code to your registered device",
    email,
    userName,
    password,
    role,
    recruiterKey,
    setUserData,
    setIsRegister
}) => {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const [errors, setErrors] = useState({});
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef([]);
    const modalRef = useRef();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
    }, [timeLeft, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setOtp(Array(length).fill(""));
            setErrors({});
            setTimeLeft(timeLimit);
            setCanResend(false);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen, length, timeLimit]);

    useEffect(() => {
        const escHandler = (e) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        document.addEventListener("keydown", escHandler);
        return () => document.removeEventListener("keydown", escHandler);
    }, [isOpen]);

    const handleClose = () => onClose && onClose();

    const handleChange = (el, idx) => {
        const val = el.value;
        if (!/^\d*$/.test(val)) {
            setErrors((prev) => ({ ...prev, [idx]: "Only numbers are allowed" }));
            return;
        }

        const newOtp = [...otp];
        newOtp[idx] = val;
        setOtp(newOtp);

        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[idx];
            return updated;
        });

        if (val && idx < length - 1) inputRefs.current[idx + 1]?.focus();

        if (newOtp.every((digit) => digit !== "")) {
            onComplete && onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (otp[idx]) {
                newOtp[idx] = "";
                setOtp(newOtp);
            } else if (idx > 0) {
                newOtp[idx - 1] = "";
                setOtp(newOtp);
                inputRefs.current[idx - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        } else if (e.key === "ArrowRight" && idx < length - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        if (!/^\d+$/.test(pasteData)) {
            setErrors({ general: "Please paste only numbers" });
            return;
        }

        const pasteArray = pasteData.slice(0, length).split("");
        const newOtp = [...otp];
        pasteArray.forEach((digit, i) => (newOtp[i] = digit));
        setOtp(newOtp);
        setErrors({});

        const next = Math.min(pasteArray.length, length - 1);
        inputRefs.current[next]?.focus();

        if (newOtp.every((digit) => digit !== "")) {
            onComplete && onComplete(newOtp.join(""));
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await onResend();
            setTimeLeft(timeLimit);
            setCanResend(false);
        } catch (error) {
            console.error("Failed to resend OTP:", error);
        } finally {
            setIsResending(false);
        }
    };

    const clearOTP = () => {
        setOtp(Array(length).fill(""));
        setErrors({});
        inputRefs.current[0]?.focus();
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join("");
        setIsVerifying(true); // Start loading
        
        try {
            const res = await axios.post("https://jobfit-s5v7.onrender.com/api/auth/verify-otp", {
                email,
                otp: enteredOtp,
            });

            if (res.data.message === "OTP verified successfully") {
                toast.success("Signup successful!", {
                    autoClose: 1000, // time in milliseconds (1 second)
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
                
                const status = "active"
                const response = await axios.post("https://jobfit-s5v7.onrender.com/api/signup", {
                    userName, email, password, role, status, recruiterKey
                });

                const generatedToken = response.data.token;
                const postUser = response.data.user;
                const responserole = response.data.user.role;

                login(postUser, generatedToken, responserole);
                setUserData({
                    userName: postUser.userName,
                    email: postUser.email,
                    sub: "",
                    picture: postUser.picture,
                    role: postUser.role,
                });

                setIsRegister(true);
                navigate("/");
            }
            onClose();
            setIsRegister(false);
        } catch (err) {
            toast.error("OTP verification failed.", {
                autoClose: 1000, // time in milliseconds (1 second)
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
            console.error("OTP verification failed:", err.response?.data || err.message);
        } finally {
            setIsVerifying(false); // Stop loading regardless of outcome
        }
    }

    const formatTime = (sec) =>
        `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            onClick={(e) => e.target === modalRef.current && handleClose()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-2xl transform transition-all duration-300 scale-100"
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <div className="mb-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <p className="text-gray-600 mt-2">
                        {subtitle.replace("{length}", length)}
                    </p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            onPaste={idx === 0 ? handlePaste : undefined}
                            disabled={disabled}
                            className={`w-12 h-12 text-xl font-bold text-center tracking-wider border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors[idx]
                                    ? "border-red-500 bg-red-50 focus:ring-red-500"
                                    : digit
                                        ? "border-green-500 bg-green-50 focus:ring-green-500"
                                        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                    ))}
                </div>

                {Object.values(errors).map((err, i) => (
                    <p key={i} className="text-sm text-center text-red-500 mb-2">
                        {err}
                    </p>
                ))}

                <div className="text-center mb-6">
{/*                     
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-blue-600 hover:text-blue-800 font-semibold underline disabled:opacity-50 transition-colors"
                        >
                            {isResending ? "Resending..." : "Resend OTP"}
                        </button> */}
                    
                        {/* // <p className="text-gray-600">
                        //     Resend OTP in{" "}
                        //     <span className="text-blue-600 font-semibold">
                        //         {formatTime(timeLeft)}
                        //     </span>
                        // </p> */}
                
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={clearOTP}
                        disabled={disabled || isVerifying}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleVerifyOtp}
                        disabled={disabled || isVerifying || otp.some((digit) => digit === "")}
                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                    >
                        {isVerifying ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                            Verifying...
                          </div>
                        ) : (
                          "Verify"
                        )}
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-500 text-center">
                    Didn't receive the code? Check your spam folder or try resending.
                </p>
            </div>
        </div>
    );
};

export default OTPDemo;