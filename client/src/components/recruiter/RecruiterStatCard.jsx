import { motion } from "framer-motion";
import { Paper, Box, Typography } from "@mui/material";

/* ──────────────── Stat Card ────────────────────── */
export const RecruiterStatCard = ({ icon, label, value, sub, iconBorder = false }) => (
  <div
    className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg bg-white border-[#9c44fe]/10 hover:border-[#9c44fe]/30
      `}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#9c44fe]/10 ${iconBorder ? "border border-[#9c44fe]/35" : "border border-transparent"}
          `}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-bold uppercase tracking-wider text-gray-400
          `}
      >
        {label}
      </span>
    </div>
    <p
      className={`text-3xl font-extrabold text-gray-900
        `}
    >
      {value}
    </p>
    {sub && <p className={`text-xs mt-1 text-gray-900`}>{sub}</p>}
  </div>
);

/* ──────────────── History Stat Card ──────────────── */
export const RecruiterHistoryStatCard = ({ icon: Icon, label, value, color, delay }) => (
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
        border: "1px solid #F1F5F9",
        bgcolor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "all 0.25s ease",
        "&:hover": { borderColor: color, boxShadow: `0 4px 16px ${color}18` },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ fontSize: 22, color }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0F172A",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
);
