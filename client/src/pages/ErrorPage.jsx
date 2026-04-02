import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileQuestion,
  ShieldOff,
  Lock,
  AlertTriangle,
  ServerCrash,
  Wrench,
  Home,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import img404 from "../assets/404.png";
import img401 from "../assets/401.png";
import img403 from "../assets/403.png";
import img400 from "../assets/400.png";
import img500 from "../assets/500.png";
import imgMaintenance from "../assets/503.png";

// ─── Error config map ──────────────────────────────────────────────────────────
const ERROR_CONFIG = {
  404: {
    code: "404",
    title: "Page Not Found",
    description:
      "The page you're looking for doesn't exist or may have been moved. Double-check the URL or head back home.",
    icon: FileQuestion,
    primaryAction: { label: "Go Home", icon: Home, to: "/" },
    secondaryAction: { label: "Go Back", icon: ArrowLeft, action: "back" },
    illustration: img404,
  },
  401: {
    code: "401",
    title: "Unauthorized Access",
    description:
      "You need to be signed in to view this page. Please log in with your credentials to continue.",
    icon: Lock,
    primaryAction: { label: "Sign In", icon: Home, to: "/login" },
    secondaryAction: { label: "Go Back", icon: ArrowLeft, action: "back" },
    illustration: img401,
  },
  403: {
    code: "403",
    title: "Access Denied",
    description:
      "You don't have permission to view this page. If you think this is a mistake, please contact support.",
    icon: ShieldOff,
    primaryAction: { label: "Go Home", icon: Home, to: "/" },
    secondaryAction: { label: "Go Back", icon: ArrowLeft, action: "back" },
    illustration: img403,
  },
  400: {
    code: "400",
    title: "Bad Request",
    description:
      "The request couldn't be understood. This might be a malformed URL or invalid input. Please try again.",
    icon: AlertTriangle,
    primaryAction: { label: "Go Home", icon: Home, to: "/" },
    secondaryAction: { label: "Try Again", icon: RefreshCw, action: "reload" },
    illustration: img400,
  },
  500: {
    code: "500",
    title: "Something Went Wrong",
    description:
      "An unexpected error occurred on our end. Our team has been notified. Please try again in a moment.",
    icon: ServerCrash,
    primaryAction: { label: "Try Again", icon: RefreshCw, action: "reload" },
    secondaryAction: { label: "Go Home", icon: Home, to: "/" },
    illustration: img500,
  },
  503: {
    code: "503",
    title: "Under Maintenance",
    description:
      "We're performing scheduled maintenance to improve your experience. We'll be back very shortly — thank you for your patience!",
    icon: Wrench,
    primaryAction: { label: "Refresh", icon: RefreshCw, action: "reload" },
    secondaryAction: null,
    illustration: imgMaintenance,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const ErrorPage = ({ code: codeProp }) => {
  const navigate = useNavigate();
  const { code: codeParam } = useParams();

  const resolvedCode = codeProp ?? codeParam ?? "404";
  const config = ERROR_CONFIG[resolvedCode] ?? ERROR_CONFIG[404];

  const {
    title,
    description,
    icon: Icon,
    primaryAction,
    secondaryAction,
    illustration,
  } = config;

  const handleAction = (action) => {
    if (!action) return;
    if (action.to) navigate(action.to);
    else if (action.action === "back") navigate(-1);
    else if (action.action === "reload") window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8 md:p-12 relative overflow-hidden">

      {/* ── Purple decorative blobs (theme accent, no grid) ── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-100 opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-100 opacity-50 blur-3xl" />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* ── Illustration ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center order-1"
          >
            {illustration ? (
              <img
                src={illustration}
                alt={title}
                className="w-full max-w-[280px] sm:max-w-md lg:max-w-xl object-contain select-none pointer-events-none transition-all duration-500 hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full max-w-md aspect-square rounded-3xl bg-purple-50 border-2 border-dashed border-purple-200 flex flex-col items-center justify-center gap-6">
                <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-purple-200" strokeWidth={1} />
                <p className="text-sm text-purple-400 font-medium text-center px-4">
                  Add{" "}
                  <code className="bg-purple-100 px-2 py-1 rounded text-purple-600 font-mono">
                    {config.code}.png
                  </code>{" "}
                  to <span className="text-purple-500">src/assets/</span>
                </p>
              </div>
            )}
          </motion.div>

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 w-full max-w-2xl mx-auto lg:mx-0"
          >
            {/* Error badge */}
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-purple-600 border border-purple-200 bg-purple-50 rounded-full px-4 py-2 mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse inline-block" />
              Error {config.code}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4 sm:mb-6">
              {title}
            </h1>

            {/* Purple accent divider */}
            <div className="w-12 h-1 bg-purple-600 mb-6 sm:mb-8 mx-auto lg:mx-0 rounded-full" />

            {/* Description */}
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mb-8 sm:mb-12">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {/* Primary — purple solid */}
              {primaryAction && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(primaryAction)}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 w-full sm:w-auto cursor-pointer shadow-xl shadow-purple-200"
                >
                  <primaryAction.icon className="w-5 h-5" />
                  {primaryAction.label}
                </motion.button>
              )}

              {/* Secondary — purple outlined */}
              {secondaryAction && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(secondaryAction)}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-purple-700 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 w-full sm:w-auto cursor-pointer"
                >
                  <secondaryAction.icon className="w-5 h-5" />
                  {secondaryAction.label}
                </motion.button>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
