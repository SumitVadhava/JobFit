import { useState } from "react";

export const ACCENT = "#9c44fe";
export const ACCENT_LIGHT = "rgba(156, 68, 254, 0.06)";
export const ACCENT_BORDER = "rgba(156, 68, 254, 0.15)";

import { motion } from 'framer-motion';
import { Box, Paper, Typography } from '@mui/material';

export const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    style={{ flex: 1, minWidth: 140 }}
  >
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: '1px solid #F1F5F9',
        bgcolor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.25s ease',
        '&:hover': { borderColor: color, boxShadow: `0 4px 16px ${color}18` },
      }}
    >
      <Box sx={{
        width: 44, height: 44, borderRadius: 2.5,
        bgcolor: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon sx={{ fontSize: 22, color }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
);

export const EmptyState = ({ icon, title, subtitle }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-gray-50">
      {icon}
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
