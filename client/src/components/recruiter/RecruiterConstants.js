import { faFilter } from "@fortawesome/free-solid-svg-icons";

/* ─────────────────── Constants ─────────────────── */
export const ACCENT = "#9c44fe";

export const HISTORY_CARD_COLORS = {
  accent: "#6B46C1",
  amber: "#B45309",
  green: "#15803D",
  blue: "#2563EB",
};

export const byPrefixAndName = {
  far: {
    filter: faFilter,
  },
};

export const STATUS_OPTIONS = [
  { value: "shortlisted", label: "Shortlisted", color: "green" },
  { value: "hired", label: "Hired", color: "indigo" },
  { value: "rejected", label: "Rejected", color: "red" },
];

export const STATUS_STYLES = {
  green: { pill: "bg-green-50 border-green-200 text-green-700", checked: "bg-green-500 border-green-500" },
  indigo: { pill: "bg-indigo-50 border-indigo-200 text-indigo-700", checked: "bg-indigo-500 border-indigo-500" },
  red: { pill: "bg-red-50 border-red-200 text-red-600", checked: "bg-red-500 border-red-500" },
};
