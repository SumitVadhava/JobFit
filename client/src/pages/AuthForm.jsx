import React, { useMemo, useState } from "react";
import * as Yup from "yup";
import { useGoogleLogin } from "@react-oauth/google";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import OTPDemo from "../components/Otp";

const AuthForm = ({ role, setUserData }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    userName: "",
    email: "",
    password: "",
    recruiterKey: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const { login } = useAuth();

  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,128}$/;

  const registerSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .trim("Password cannot include leading or trailing spaces")
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password cannot exceed 128 characters")
      .matches(
        PASSWORD_REGEX,
        "Password must include one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    recruiterKey: Yup.string().when("role", {
      is: (value) => value === "recruiter",
      then: (schema) => schema.required("Recruiter Key is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .trim("Password cannot include leading or trailing spaces")
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password cannot exceed 128 characters")
      .matches(
        PASSWORD_REGEX,
        "Password must include one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    recruiterKey: Yup.string().when("role", {
      is: (value) => value === "recruiter",
      then: (schema) => schema.required("Recruiter Key is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const schema = useMemo(() => {
    return isLogin ? loginSchema : registerSchema;
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Validate the changed field
    schema
      .validateAt(name, { ...formValues, [name]: value, role }, { context: { role } })
      .then(() => {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, [name]: err.message }));
      });
  };

  const handleResend = async () => {
    if (!email) {
      setVerificationResult("❗ Email is required to resend OTP");
      return;
    }

    try {
      const res = await fetch("https://jobfit-s5v7.onrender.com/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      setVerificationResult("📨 OTP sent successfully!");
      return Promise.resolve();
    } catch (err) {
      setVerificationResult("❌ Failed to send OTP.");
      return Promise.reject(err);
    }
  };

  const handleOTPComplete = async (otp) => {
    setIsLoading(true);
    setVerificationResult("🔄 Verifying OTP...");

    try {
      const res = await fetch("https://jobfit-s5v7.onrender.com/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerificationResult("✅ OTP verified successfully!");
        setIsOTPOpen(false);

        // After successful OTP verification, proceed with registration
        try {
          const registerRes = await fetch("https://jobfit-s5v7.onrender.com/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          });

          const registerData = await registerRes.json();

          if (registerRes.ok) {
            const { token, user } = registerData;
            login(user, token);
            navigate("/dashboard");
          } else {
            setVerificationResult("❌ Registration failed. Please try again.");
          }
        } catch (err) {
          setVerificationResult("❌ Registration failed.");
        }
      } else {
        setVerificationResult("❌ Invalid OTP. Please try again.");
      }
    } catch (err) {
      setVerificationResult("❌ Verification failed.");
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate the entire form
      await schema.validate(formValues, { context: { role }, abortEarly: false });
      console.log("handleSubmit called with values:", formValues);
      // Simulate API call

      if (!isLogin) {
        // For signup, first send OTP
        setIsOtpLoading(true); // Start loading
        try {
          const response = await axios.post("https://jobfit-s5v7.onrender.com/api/auth/send-otp", {
            email: formValues.email,
          });

          if (response.data.message === "OTP sent to your email") {
            setIsOTPOpen(true);
          } else if (response.data.message === "User already exists") {
            toast.error("Email already registered!", {
              autoClose: 900,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
            });
          }
        } catch (error) {
          toast.error("Failed to send OTP. Please try again.", {
            autoClose: 900,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });
          console.error("Error sending OTP:", error);
        } finally {
          setIsOtpLoading(false); // Stop loading regardless of outcome
        }
      } else {
        const { userName, email, password, recruiterKey } = formValues;

        const status = "active";
        console.log(userName, email, password, status, role, recruiterKey);

        const response = await axios.post("https://jobfit-s5v7.onrender.com/api/login", { email, password, role, recruiterKey });

        if (response.data.message === "Invalid credentials") {
          toast.error("Login Failed!", {
            autoClose: 900, // time in milliseconds (1 second)
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });
          return;
        }

        if (response.data.message === "Login successful") {
          toast.success("Login Successful!", {
            autoClose: 900, // time in milliseconds (1 second)
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });
        }

        console.log('User saved:', response.data);
        const generatedToken = response.data.token;
        const postUser = response.data.user;
        const responserole = response.data.user.role;

        login(
          postUser,
          generatedToken,
          responserole,
        )

        setUserData({
          userName: postUser.userName,
          email: postUser.email,
          sub: "",
          picture: postUser.picture,
          role: postUser.role,
        });
        setIsLogin(true);
        navigate("/");
      }
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted!");
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Authentication Failed !", {
        autoClose: 900, // time in milliseconds (1 second)
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        console.error("Validation errors:", newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google token:", tokenResponse.access_token);
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userInfo = res.data;
        console.log("User Info:", userInfo);

        const userToSave = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          google_id: userInfo.sub,
          role: role,
        };

        axios
          .post("https://jobfit-s5v7.onrender.com/api/Google_login", userToSave)
          .then((response) => {
            console.log("User saved:", response.data);
            login(response.data.user, response.data.token, role);
            setUserData({
              userName: response.data.user.name,
              email: response.data.user.email,
              sub: response.data.user.google_id,
              picture: response.data.user.picture,
              role: role,
            });


            // onClose();
            navigate("/");
          })
          .catch((error) => {
            console.error("Error saving user:", error);
          });

        console.log(response.data.user);



      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
    },
    flow: "implicit",
  });

  return (
    <div className="flex items-center justify-center h-[85vh] bg-white p-5">
      <div className="flex flex-col gap-2.5 bg-white p-8 w-[450px] rounded-2xl font-sans border-2 border-purple-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {role !== "admin" && (
            <div className="flex flex-col gap-2.5 google-btn">
              <div>
                <button
                  type="button"
                  onClick={handleSuccess}
                  className="mt-2.5 w-full h-[50px] rounded-xl flex justify-center items-center font-medium gap-2.5 border border-[#ededef] bg-white cursor-pointer hover:border-[#2d79f3] transition-all group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width={20}
                    className="google-icon transition-transform duration-500 ease-in-out group-hover:animate-[spin_0.8s_ease-in-out]"
                  >
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C2.92 15.07 2 17.87 2 20.83c0 2.96 1.02 5.76 2.79 8.15l7.74-6.39z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm my-2">
                <span className="border-t flex-1"></span>
                <span className="uppercase">or {isLogin ? "Login" : "Sign Up"} with email</span>
                <span className="border-t flex-1"></span>
              </div>
            </div>
          )}
          {!isLogin && (
            <div>
              <div className="flex flex-col">
                <label className="text-[#151717] font-semibold">User Name</label>
              </div>
              <div className="flex items-center h-[50px] border-[1.5px] border-[#ecedec] rounded-xl pl-2.5 transition-all focus-within:border-[#2d79f3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 32 32"
                >
                  <g data-name="Layer 3" id="Layer_3">
                    <path d="m30.853 13.87a15 15 0 0 0-29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0-1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1-4.158-.759v-10.856a1 1 0 0 0-2 0v1.726a8 8 0 1 0.2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6z" />
                  </g>
                </svg>
                <input
                  name="userName"
                  value={formValues.userName}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className="ml-2.5 w-full h-full rounded-xl border-none focus:outline-none bg-white"
                  type="text"
                />
              </div>
              {errors.userName && <div className="text-red-500 text-sm">{errors.userName}</div>}
            </div>
          )}
          <div className="flex flex-col">
            <label className="text-[#151717] font-semibold">Email</label>
          </div>
          <div className="flex items-center h-[50px] border-[1.5px] border-[#ecedec] rounded-xl pl-2.5 transition-all focus-within:border-[#2d79f3]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 32 32"
            >
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0-29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0-1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1-4.158-.759v-10.856a1 1 0 0 0-2 0v1.726a8 8 0 1 0.2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6z" />
              </g>
            </svg>
            <input
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="ml-2.5 w-full h-full rounded-xl border-none focus:outline-none bg-white"
              type="email"
            />
          </div>
          {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          <div className="flex flex-col">
            <label className="text-[#151717] font-semibold">Password</label>
          </div>
          <div className="flex items-center h-[50px] border-[1.5px] border-[#ecedec] rounded-xl pl-2.5 transition-all focus-within:border-[#2d79f3]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="-64 0 512 512"
            >
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
            <input
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              className="ml-2.5 w-full h-full rounded-xl border-none focus:outline-none bg-white"
              type={showPassword ? "text" : "password"}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="mr-4 text-gray-400 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
          </div>
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
          {role === "recruiter" && (
            <div>
              <div className="flex flex-col">
                <label className="text-[#151717] font-semibold">Recruiter Key</label>
              </div>
              <div className="flex items-center h-[50px] border-[1.5px] border-[#ecedec] rounded-xl pl-2.5 transition-all focus-within:border-[#2d79f3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="-64 0 512 512"
                >
                  <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                  <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                </svg>
                <input
                  name="recruiterKey"
                  value={formValues.recruiterKey}
                  onChange={handleChange}
                  placeholder="Enter your Recruiter Key"
                  className="ml-2.5 w-full h-full rounded-xl border-none focus:outline-none bg-white"
                  type="text"
                />
              </div>
              {errors.recruiterKey && <div className="text-red-500 text-sm">{errors.recruiterKey}</div>}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isOtpLoading}
            className="mt-5 mb-2.5 bg-[#151717] text-white text-base font-medium rounded-xl h-[50px] w-full cursor-pointer hover:bg-[#0d0e0e] transition-colors relative"
          >
            {isOtpLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Sending OTP...
              </div>
            ) : (
              <>{isLogin ? "Login" : "Sign Up"}</>
            )}
          </button>
          {role !== "admin" && (
            <p className="text-center text-black text-sm my-1.5">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-[#2d79f3] font-medium cursor-pointer"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          )}
        </form>
      </div>
      {isOTPOpen && (
        <OTPDemo
          isOpen={isOTPOpen}
          onClose={() => setIsOTPOpen(false)}
          email={formValues.email}
          userName={formValues.userName}
          password={formValues.password}
          role={role}
          recruiterKey={formValues.recruiterKey}
          setUserData={setUserData}
          onResend={async () => {
            try {
              await axios.post("https://jobfit-s5v7.onrender.com/api/auth/send-otp", {
                email: formValues.email,
              });
              return Promise.resolve();
            } catch (error) {
              return Promise.reject(error);
            }
          }}
          setIsRegister={setIsLogin}
        />
      )}
    </div>
  );
};

export default AuthForm;
