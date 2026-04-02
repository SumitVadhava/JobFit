import { useState } from "react";

export const ACCENT = "#9c44fe";
export const ACCENT_LIGHT = "rgba(156, 68, 254, 0.06)";
export const ACCENT_BORDER = "rgba(156, 68, 254, 0.15)";

import { motion } from 'framer-motion';
import { Box, Paper, Typography } from '@mui/material';

export const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="flex-1 min-w-[140px]"
  >
    <div
      className="p-5 rounded-2xl border bg-white flex items-center gap-4 transition-all duration-300 h-full"
      style={{
        borderColor: "#F1F5F9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 4px 16px ${color}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#F1F5F9";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}12` }}
      >
        {Icon.render ? <Icon sx={{ fontSize: 22, color }} /> : <Icon size={22} style={{ color }} />}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-black text-black mt-0.5 leading-none">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);


export const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-gray-50">
      {Icon && <Icon size={32} className="text-gray-300 mx-auto" />}
    </div>
    <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm mx-auto">{subtitle}</p>
  </div>
);

export const CompanyLogo = ({ src, name, size = "w-12 h-12" }) => {
  const [hasError, setHasError] = useState(false);
  const initial = (name || "J").charAt(0).toUpperCase();

  if (hasError || !src) {
    return (
      <div
        className={`${size} rounded-xl flex items-center justify-center text-white font-bold`}
        style={{ background: ACCENT }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      className={`${size} rounded-xl overflow-hidden border-2 border-gray-100 shrink-0`}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
