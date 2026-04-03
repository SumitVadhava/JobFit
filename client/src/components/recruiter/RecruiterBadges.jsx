import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Monitor,
  BookmarkIcon,
} from "lucide-react";

/* ───────────── Status Badge ───────────── */
export const RecruiterStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toLowerCase();
  const config = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Pending Review",
    },
    risky: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Risky",
    },
    verified: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "Verified",
    },
    reviewed: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "Reviewed",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "Rejected",
    },
  };

  const style = config[normalizedStatus] || config.pending;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.icon}
      <span>{style.label}</span>
    </span>
  );
};

/* ───────────── Workplace Badge ───────────── */
export const RecruiterWorkplaceBadge = ({ type }) => {
  const normalizedType = String(type || "").toLowerCase();
  const config = {
    remote: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      label: "Remote",
    },
    hybrid: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Hybrid",
    },
    onsite: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      label: "On-site",
    },
  };

  const style = config[normalizedType] || config.onsite;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <Monitor className="w-3 h-3" />
      <span>{style.label}</span>
    </span>
  );
};
