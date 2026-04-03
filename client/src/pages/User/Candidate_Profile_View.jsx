import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "../../components/Skeleton";
import { 
  Camera, 
  Check, 
  Edit, 
  Save, 
  Share2, 
  Trash2, 
  X, 
  Pencil, 
  TriangleAlert 
} from "lucide-react";

/* ── ATS Circular Gauge ─────────────────────────────────────── */
const AtsGauge = ({ score }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="144" height="144" viewBox="0 0 144 144">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx="72" cy="72" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke="url(#g)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ * 0.25}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="72" y="67" textAnchor="middle" fontSize="26" fontWeight="800" fill="#0f172a" fontFamily="inherit">{score}</text>
        <text x="72" y="84" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="inherit" fontWeight="600">ATS Score</text>
      </svg>
      <span
        className="text-xs font-bold px-3 py-1 rounded-full"
        style={{ background: `${color}18`, color }}
      >{label}</span>
    </div>
  );
};

/* ── Cloudinary Browser Helper ────────────────────────────── */
/** 
 * No longer uploads directly to Cloudinary from the frontend to avoid preset issues.
 * Instead, it converts the file to base64 and lets the server handle the signed upload.
 */
const getFileBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error("File conversion failed"));
    reader.readAsDataURL(file);
  });
};

/* ── Inline Icon helper ─────────────────────────────────────── */
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className="shrink-0">
    <path d={d} />
  </svg>
);

const ICONS = {
  trash: "M216,48h-40V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z",
  edit: "M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.32,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l12.68-12.69L204.69,96Z",
  save: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-192,64a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,256q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l64-192A16,16,0,0,0,227.32,28.68ZM158.46,233.15l-37-78.23L153.37,123A8,8,0,0,0,142.05,111.7l-31.91,31.92L31.91,106.6Z",
  camera: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z",
  x: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
  plus: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z",
  clock: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
  upload: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H216V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z",
  share: "M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,65.89,8,8,0,0,1-15.49-4A104,104,0,0,1,165,96H204.69L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z",
  about: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z",
  brief: "M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V72H216V200Z",
  grad: "M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87V168a8,8,0,0,0,16,0V126.41l39.76,21.2A88.16,88.16,0,0,0,80,216a8,8,0,0,0,16,0,72,72,0,0,1,144,0,8,8,0,0,0,16,0,88.16,88.16,0,0,0-7.76-68.39L251.76,103.06A8,8,0,0,0,251.76,88.94ZM128,42l106.88,57L128,155.94,21.12,99Z",
  skills: "M224,115.55V208a16,16,0,0,1-16,16H163.09A119.83,119.83,0,0,1,128,240a120.24,120.24,0,0,1-35.09-5.18h0A119.83,119.83,0,0,1,92.91,224H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,7.24-13.38L120.59,48.61a16,16,0,0,1,14.82,0l81.35,53.56A16,16,0,0,1,224,115.55Z",
  lang: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM215.82,120H171.8a183.08,183.08,0,0,0-5.83-48H199.1A88.16,88.16,0,0,1,215.82,120ZM128,40.16a166.75,166.75,0,0,1,27,31.84H101A166.75,166.75,0,0,1,128,40.16ZM89.92,72h32a183.08,183.08,0,0,1,5.83,48H40.2A88.18,88.18,0,0,1,89.92,72ZM40.18,136H83.82a183.08,183.08,0,0,0,5.83,48H56.91A88.16,88.16,0,0,1,40.18,136Zm87.82,79.84a166.75,166.75,0,0,1-27-31.84h54A166.75,166.75,0,0,1,128,215.84Zm43.91-31.84h33.12a183.08,183.08,0,0,1-5.83-48H172A88.18,88.18,0,0,1,171.91,184Z",
  copy: "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z",
  check: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
  loading: "M224,128a96,96,0,0,1-192,0,8,8,0,0,1,8-8h16a80,80,0,0,1,160,0,8,8,0,0,1-8,8Z",
  spinner: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,192H40V64H216V192Z",
  cpu: "M208,136h-8V120h8a8,8,0,0,0,0-16h-8V96a16,16,0,0,0-16-16H168V72a8,8,0,0,0-16,0V80H136V72a8,8,0,0,0-16,0V80H104V72a8,8,0,0,0-16,0V80H80A16,16,0,0,0,64,96v8H56a8,8,0,0,0,0,16h8v16H56a8,8,0,0,0,0,16h8v8a16,16,0,0,0,16,16h8v8a8,8,0,0,0,16,0v-8h16v8a8,8,0,0,0,16,0v-8h16v8a8,8,0,0,0,16,0v-8h8a16,16,0,0,0,16-16v-8h8a8,8,0,0,0,0-16Zm-24,24H80V96H184v64Zm-56-48H112a8,8,0,0,0,0,16h12v12a8,8,0,0,0,16,0V128h12a8,8,0,0,0,0-16Z",
  heart: "M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94a62,62,0,0,1,116-23.22A62,62,0,0,1,240,94Z",
};

/* ── Section Card ───────────────────────────────────────────── */
const ACCENT = {
  blue: { headerBg: "from-blue-50 to-white", iconBg: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-indigo-500", company: "bg-blue-50 text-blue-700" },
  indigo: { headerBg: "from-indigo-50 to-white", iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100", dot: "bg-indigo-500", company: "bg-indigo-50 text-indigo-700" },
  violet: { headerBg: "from-violet-50 to-white", iconBg: "bg-violet-50 text-violet-600 border-violet-100", dot: "bg-violet-500", company: "bg-violet-50 text-violet-700" },
  emerald: { headerBg: "from-emerald-50 to-white", iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500", company: "bg-emerald-50 text-emerald-700" },
};

const Section = ({ icon, label, accent = "blue", children }) => {
  const a = ACCENT[accent];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r ${a.headerBg}`}>
        <span className={`flex items-center justify-center w-8 h-8 rounded-xl border ${a.iconBg} shadow-sm`}>
          <Ic d={ICONS[icon]} size={16} />
        </span>
        <h2 className="text-base font-semibold text-slate-800 tracking-tight">{label}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

/* ── Skill Pill (view) ─────────────────────────────────────── */
const SkillPill = ({ label, color = "slate" }) => {
  const map = {
    slate: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
  };
  return (
    <span className={`inline-flex items-center text-xs font-600 font-semibold px-3 py-1.5 rounded-lg border transition-colors duration-150 ${map[color]}`}>
      {label}
    </span>
  );
};

/* ── Editable Skill Item ─────────────────────────────────────── */
const EditableSkill = ({ value, onChange, onRemove, placeholder }) => (
  <div className="flex items-center bg-white border-1.5 border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
    <input
      className="text-xs font-semibold text-slate-800 bg-transparent border-none outline-none px-3 py-1.5 w-28"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "Skill…"}
    />
    <button
      onClick={onRemove}
      className="flex items-center justify-center w-7 h-7 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors border-l border-slate-100"
    >
      <Ic d={ICONS.x} size={11} />
    </button>
  </div>
);

/* ── Add button ─────────────────────────────────────────────── */
const AddBtn = ({ onClick, label, color = "slate" }) => {
  const map = {
    blue: "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    violet: "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    rose: "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
    slate: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      className={`mt-2 inline-flex items-center gap-1.5 h-8 px-3 text-xs font-bold rounded-lg border border-dashed transition-colors ${map[color]}`}
    >
      <Ic d={ICONS.plus} size={12} /> {label}
    </button>
  );
};

/* ── Edit Card (Experience / Education) ─────────────────────── */
const EditCard = ({ onRemove, children }) => (
  <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
    <button
      onClick={onRemove}
      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
    >
      <Ic d={ICONS.x} size={11} />
    </button>
    {children}
  </div>
);

/* ── Constants ─────────────────────────────────────────────── */
const EXPERIENCE_RANGES = ["0-2", "2-4", "4-6", "6-8", "8-10", "10+"];

/* ── Shadcn-style Custom Select (portal-based) ────────────── */
const ShadcnSelect = ({ value, onChange, options, placeholder = "Select…" }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  // Recalculate position when opened
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        popoverRef.current?.contains(e.target)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find(o => o.value === value);

  const popover = open
    ? ReactDOM.createPortal(
      <div
        ref={popoverRef}
        className="fixed z-[9999] rounded-lg border border-slate-200 bg-white shadow-lg"
        style={{
          top: pos.top,
          left: pos.left,
          width: pos.width,
          animation: "shadcn-pop 0.15s ease-out",
        }}
      >
        <div className="p-1 max-h-[220px] overflow-auto">
          {options.map(opt => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`
                    w-full flex items-center justify-between gap-2 px-2.5 py-2 text-sm rounded-md
                    transition-colors duration-100 outline-none
                    ${isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                  }
                  `}
              >
                <span>{opt.label}</span>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="text-indigo-600 shrink-0"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <div className="relative min-w-[160px]">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`
          w-full flex items-center justify-between gap-2
          h-10 px-3 text-sm font-medium rounded-lg border
          bg-white shadow-sm transition-all duration-150
          ${open
            ? "border-indigo-400 ring-2 ring-indigo-100"
            : "border-slate-200 hover:border-slate-300"
          }
        `}
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {popover}

      {/* Inline keyframe for pop animation */}
      <style>{`
        @keyframes shadcn-pop {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Candidate_Profile_View = ({ userProp }) => {

  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  
  const normalizeId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value.$oid) return String(value.$oid);
      if (value._id) return String(value._id);
    }
    return String(value);
  };

  const currentUserId = normalizeId(user?._id || user?.id || "");
  const [profileOwnerId, setProfileOwnerId] = useState("");

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !paramId || (!!currentUserId && currentUserId === profileOwnerId);

  const [data, setData] = useState({
    name: "",
    userName: "",
    email: "",
    resumeSummary: "",
    totalExperience: "0-2",
    education: [],
    techSkills: [],
    softSkills: [],
    atsScore: 0,
    profilePicture: "",
    resumeLink: "",
    profileId: "",
  });

  const [editing, setEditing] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSkillTab, setActiveSkillTab] = useState("tech");
  const [dragActive, setDragActive] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const galleryImages = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=0f172a&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=2563eb&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=7c3aed&color=fff&size=200`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=059669&color=fff&size=200`,
  ];

  /* ── Helper to map API response into component state ────── */
  const mapProfileToState = (profile, userName, userEmail, userPicture) => ({
    // DB schema stores 'userName', not 'name' — use it as the primary display name source
    name: profile?.userName || userName || "",
    userName: profile?.userName || userName || "",
    email: profile?.email || userEmail || "",
    resumeSummary: profile?.description || "",
    profileId: profile?._id || "",
    totalExperience: (() => {
      const raw = profile?.experience;
      // If it's already a valid range string, use it directly
      if (typeof raw === "string" && EXPERIENCE_RANGES.includes(raw)) return raw;
      // Convert numeric value to the matching range
      const num = Number(raw) || 0;
      if (num >= 10) return "10+";
      if (num >= 8) return "8-10";
      if (num >= 6) return "6-8";
      if (num >= 4) return "4-6";
      if (num >= 2) return "2-4";
      return "0-2";
    })(),
    education: (profile?.education || []).map(edu => ({
      degree: edu.degree || "",
      date: edu.yearOfPassing ? `${edu.yearOfPassing}` : "",
      institution: edu.university || "",
    })),
    techSkills: (profile?.skills || []).map(s => s.skillName || s),
    softSkills: (profile?.softSkills || []).map(s => s.skillName || s),
    atsScore: profile?.atsScore || 0,
    profilePicture: profile?.img || userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.userName || userName || "User")}&background=6B46C1&color=fff&size=200`,
    resumeLink: profile?.resumeLink || "",
  });

  /* ── Helper to map state back to API shape ────────────── */
  const mapStateToApi = () => {
    const payload = {};
    // DB schema only has 'userName' (not 'name') — sync data.name into userName
    if (data.userName?.trim()) payload.userName = data.userName.trim();

    if (data.resumeSummary?.trim()) payload.description = data.resumeSummary.trim();
    if (data.profilePicture?.trim()) payload.img = data.profilePicture.trim();

    // Always sync ATS score if managed by client
    payload.atsScore = data.atsScore || 0;

    // Sync experience range as a string directly
    if (data.totalExperience) {
      payload.experience = data.totalExperience;
    }

    payload.education = data.education
      .filter(edu => (edu.degree || edu.institution).trim())
      .map(edu => ({
        degree: (edu.degree || "Other").trim(),
        university: (edu.institution || "Unknown").trim(),
        yearOfPassing: parseInt(edu.date) || new Date().getFullYear(),
      }));

    payload.skills = data.techSkills
      .filter(s => s.trim())
      .map(s => ({ skillName: s.trim() }));

    payload.softSkills = data.softSkills
      .filter(s => s.trim())
      .map(s => ({ skillName: s.trim() }));

    return payload;
  };

  /* ── Fetch profile on mount ──────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        let profile = null;
        let bestAts = -1;
        try {
          const userIdToFetch = paramId || (user?._id || user?.id);
          if (isOwnProfile) {
            response = await api.get("/candidate/profile");
          } else {
            response = await api.get(`/candidate/profile/${userIdToFetch}`);
          }
          if (response) {
            profile = response.data.data || response.data.profile;
            if (profile) {
              setProfileOwnerId(normalizeId(profile.user?._id || profile.user || currentUserId || ""));
            }
          }

          // Compute best ATS dynamically from ATS history and Resumes
          // Compute best ATS dynamically from ATS history and Resumes
          if (userIdToFetch && isOwnProfile) {
            const [resumeRes, atsHistoryRes] = await Promise.all([
              api.get("/candidate/ats-analyzer").catch(() => null),
              api.get("/candidate/ats-analyzer").catch(() => null), // If there's a separate history endpoint, use it here
            ]);
            const resumesList = resumeRes?.data?.resumes || resumeRes?.data || [];
            const normalised = Array.isArray(resumesList) ? resumesList : [];
            const atsData = atsHistoryRes?.data?.data?.atsScores || atsHistoryRes?.data?.history || [];
            const rScores = normalised.map(r => r.atsScore || 0);
            const hScores = atsData.map(h => h.score || 0);
            const allScores = [...rScores, ...hScores];
            if (allScores.length > 0) {
              bestAts = Math.max(...allScores);
            }
          }
        } catch (e) {
          // Ignore API error and fallback to dummy data
          if (e.response?.status === 404 && isOwnProfile) {
            setProfileExists(false);
          }
        }

        // Get user info — for own profile use userProp/auth, for others use populated data
        // Get user info — check both the flat profile fields and the populated user object
        const userName = isOwnProfile
          ? (userProp?.userName || user?.userName || user?.name || "")
          : (profile?.userName || profile?.name || profile?.user?.userName || profile?.user?.name || "User");
        const userEmail = isOwnProfile
          ? (userProp?.email || user?.email || "")
          : (profile?.email || profile?.user?.email || "");
        const userPicture = isOwnProfile
          ? (userProp?.picture || user?.picture || "")
          : (profile?.img || profile?.user?.picture || "");

        if (profile) {
          const mappedProfile = mapProfileToState(profile, userName, userEmail, userPicture);
          if (bestAts > -1) mappedProfile.atsScore = bestAts;
          setData(mappedProfile);
          setProfileExists(true);
        } else if (isOwnProfile) {
          // No profile? Start with auth info and zero'd stats
          setData({
            name: userName || "",
            userName: userName || "",
            email: userEmail || "",
            resumeSummary: "",
            totalExperience: 0,
            education: [],
            techSkills: [],
            softSkills: [],
            atsScore: bestAts > -1 ? bestAts : 0,
            profilePicture: userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=0f172a&color=fff&size=200`,
            resumeLink: "",
          });
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // If profile not found (404), show dummy data or empty state
        if (err.response?.status === 404 && isOwnProfile) {
          setProfileExists(false);
        } else if (!isOwnProfile) {
          setError("Profile not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [paramId, isOwnProfile]);

  useEffect(() => {
    if (userProp) setData(p => ({ ...p, name: userProp.userName || p.name, profilePicture: userProp.picture || p.profilePicture }));
  }, [userProp]);


  const set = (f, v) => setData(p => ({ ...p, [f]: v }));
  const setExp = (i, f, v) => { const a = [...data.experience]; a[i] = { ...a[i], [f]: v }; set("experience", a); };
  const setEdu = (i, f, v) => { const a = [...data.education]; a[i] = { ...a[i], [f]: v }; set("education", a); };
  const setArr = (field, i, v) => { const a = [...data[field]]; a[i] = v; set(field, a); };
  const removeArr = (field, i) => set(field, data[field].filter((_, x) => x !== i));
  const addArr = (field, val) => set(field, [...data[field], val]);

  const handleSave = async () => {
    if (!data.name.trim()) return toast.error("Name is required");
    setUploading(true);
    setSaving(true);
    const payload = mapStateToApi();
    // Ensure userName is synced with name field
    if (data.name?.trim()) payload.userName = data.name.trim();

    try {
      let response;
      if (profileExists) {
        response = await api.put("/candidate/profile", payload, { headers: { 'Content-Type': 'application/json' } });
      } else {
        response = await api.post("/candidate/profile", payload, { headers: { 'Content-Type': 'application/json' } });
        setProfileExists(true);
      }

      const updatedProfile = response.data?.data || response.data?.profile;

      // Update local state from the API response so the view refreshes correctly
      // Use data.name as the fallback since auth context userName hasn't updated yet at this point
      if (updatedProfile) {
        const freshName = data.name?.trim() || user?.userName || user?.name || "";
        const userEmail = user?.email || data.email;
        const userPicture = updatedProfile.img || data.profilePicture;
        setData(mapProfileToState(updatedProfile, freshName, userEmail, userPicture));
      }

      // Update global auth state to reflect changes in Navbar/Avatar
      const picToSync = updatedProfile?.img || data.profilePicture;
      updateUser({
        userName: data.name,
        picture: picToSync,
        img: picToSync
      });

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setProfilePhotoFile(null); // Clear the file after save
      toast.success("Profile saved successfully!", { position: "top-center", autoClose: 3000 });
    } catch (err) {
      console.error("Error saving profile:", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      toast.error(`Error saving profile: ${serverMsg}`, { position: "top-center", autoClose: 4000 });
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }


  /* Delete Profile ─────────────────────────────────────────── */
  const handleDeleteProfile = async () => {
    if (deleteConfirmationText !== "delete profile") return;
    try {
      setDeletingProfile(true);

      // Perform the API deletion first while the token is still active
      await api.delete("/candidate/profile");

      // Completely wipe local storage after the API responds successfully
      localStorage.clear();

      toast.success("Profile deleted successfully", { position: "top-center", autoClose: 2000 });
      setTimeout(() => {
        logout();
        navigate("/");
      }, 1000);
    } catch (err) {
      toast.error("Failed to delete profile", { position: "top-center", autoClose: 2000 });
      setDeletingProfile(false);
      setShowDeleteModal(false);
    }
  };

  /* Native Share API ─────────────────────────────────────────── */
  const handleShare = async () => {
    // Explicitly use the fetched Profile ID, ignoring any old URL parameters to avoid 404s
    const idToShare = data.profileId;
    if (!idToShare) {
      return toast.error("Profile ID not found. Ensure profile is saved.");
    }
    const profileUrl = `${window.location.origin}/candidate/profile/${idToShare}`;
    const shareData = {
      title: `${data.name} — Candidate Profile`,
      text: `Check out ${data.name}'s profile: ${data.totalExperience !== 0 ? data.totalExperience + " years" : "Fresher"} · ATS Score ${data.atsScore}%`,
      url: profileUrl,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { }
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    }
  };

  const handleUpload = (e) => {
    setUploading(true);
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setProfilePhotoFile(file);
      const r = new FileReader();
      r.onload = ev => { set("profilePicture", ev.target.result); setGallery(false); setUploading(false); };
      r.onerror = () => { alert("Upload failed."); setUploading(false); };
      r.readAsDataURL(file);
    } else { alert("Invalid image."); setUploading(false); }
  };

  const processResumeFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      return toast.error("Only PDF files are allowed.", { position: "top-center" });
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File exceeds 5MB limit. Please upload a smaller PDF.", { position: "top-center" });
    }
    setUploading(true);

    try {
      const base64Resume = await getFileBase64(file);

      const payload = { resumeLink: base64Resume };
      let res;
      if (profileExists) {
        res = await api.put("/candidate/profile", payload, { headers: { 'Content-Type': 'application/json' } });
      } else {
        res = await api.post("/candidate/profile", payload, { headers: { 'Content-Type': 'application/json' } });
        setProfileExists(true);
      }

      const updatedResumeLink = res.data?.data?.resumeLink;
      if (updatedResumeLink) {
        set("resumeLink", updatedResumeLink);
      }
      setSaved(true);
      toast.success("Resume uploaded successfully!", { position: "top-center" });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error("Resume upload failed.", { position: "top-center" });
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = (e) => processResumeFile(e.target.files[0]);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (!isOwnProfile || uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processResumeFile(e.dataTransfer.files[0]);
  };

  /* ── Loading State ────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-poppins">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-16 space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-6 py-5">
            <div className="flex flex-wrap items-center gap-5">
              <Skeleton variant="circle" className="h-24 w-24 shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <Skeleton variant="title" className="h-7 w-1/2" />
                <Skeleton variant="text" className="h-4 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton variant="button" className="h-9 w-20" />
                <Skeleton variant="button" className="h-9 w-32" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5">
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                  <Skeleton variant="title" className="h-5 w-1/3" />
                  <Skeleton variant="text" className="h-4 w-full" />
                  <Skeleton variant="text" className="h-4 w-4/5" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                  <Skeleton variant="title" className="h-5 w-3/4 mb-4" />
                  <Skeleton variant="text" className="h-4 w-full" />
                  <Skeleton variant="text" className="h-4 w-full mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ──────────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }
  /**
   * Universal image error handler to provide stable fallback
   */
  const handleImgError = (e) => {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=6B46C1&color=fff&size=200`;
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp{ from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
        .anim-up  { animation: fadeUp .45s ease both; }
        .anim-in  { animation: fadeIn .2s ease both; }
        .anim-modal { animation: slideUp .25s ease both; }
        .anim-spin { animation: spin .7s linear infinite; }
        .d100 { animation-delay:100ms; }
        .d180 { animation-delay:180ms; }
        .d260 { animation-delay:260ms; }
        .d340 { animation-delay:340ms; }
        .d420 { animation-delay:420ms; }
        .d500 { animation-delay:500ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-poppins">



        {/* ── Main Container ─────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-16">

          {/* ── Header Card ────────────────────────────────────── */}
          <div className="anim-up bg-white border border-slate-200 rounded-2xl shadow-lg px-6 py-5 relative z-10 flex flex-wrap items-center gap-5">

            {/* Avatar */}
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200 shrink-0 ${editing ? "cursor-pointer" : ""}`}
              onClick={() => editing && setGallery(true)}
            >
              <img 
                src={data.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                onError={handleImgError}
              />
              {editing && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera size={22} className="shrink-0 text-white" />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <>
                  <input
                    className="text-2xl font-bold text-slate-900 bg-blue-50 border-b-2 border-blue-500 rounded-t-lg px-2 py-1 w-full outline-none"
                    value={data.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Full Name"
                  />
                  <p className="text-sm font-medium text-slate-500 mt-2 px-2 select-all cursor-copy" title="Email is non-editable">
                    {data.email}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{data.name}</h1>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">
                    {data.email}
                  </p>
                </>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 tracking-wide">● Available</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 tracking-wide">Open to Offers</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <Ic d={ICONS.check} size={12} /> Saved
                </span>
              )}
              {shared && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                  <Ic d={ICONS.check} size={12} /> Copied!
                </span>
              )}

              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-all hover:-translate-y-px shadow-md shadow-blue-200 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} /> <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all hover:-translate-y-px"
                  >
                    <Share2 size={14} /> Share
                  </button>
                  {isOwnProfile && (
                    <>
                      <button
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-all hover:-translate-y-px shadow-md"
                      >
                        <Pencil size={14} /> Edit Profile
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmationText("");
                          setShowDeleteModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} /> Delete Profile
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Content Grid ─────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 items-start">

            {/* Left — Sections ──────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* About */}
              <div className="anim-up d100">
                <Section icon="about" label="About" accent="blue">
                  {editing ? (
                    <textarea
                      rows={4}
                      className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 outline-none resize-vertical transition-all"
                      value={data.resumeSummary}
                      onChange={e => set("resumeSummary", e.target.value)}
                      placeholder="Write a professional summary…"
                    />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {data.resumeSummary || <em className="text-slate-400">No summary provided.</em>}
                    </p>
                  )}
                </Section>
              </div>

              {/* Experience */}
              <div className="anim-up d180">
                <Section icon="brief" label="Experience" accent="indigo">
                  <div className="group relative rounded-2xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Ic d={ICONS.clock} size={22} />
                        </div> */}
                        <div>
                          <p className="text-sm font-bold text-slate-800 tracking-tight">Total Experience</p>
                          <p className="text-xs text-slate-500 font-medium">Accumulated professional history</p>
                        </div>
                      </div>
                      <div className="relative">
                        {editing ? (
                          <ShadcnSelect
                            value={data.totalExperience}
                            onChange={val => set("totalExperience", val)}
                            options={EXPERIENCE_RANGES.map(r => ({ value: r, label: `${r} Years` }))}
                            placeholder="Select experience…"
                          />
                        ) : (
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
                            <span className="text-lg font-black text-indigo-600">{data.totalExperience + " Years" || "0-2" + " Years"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Section>
              </div>

              {/* Education */}
              <div className="anim-up d260">
                <Section icon="grad" label="Education" accent="violet">
                  <div className="flex flex-col gap-4">
                    {data.education.length === 0 && !editing && <p className="text-sm italic text-slate-400">No education added.</p>}
                    {data.education.map((edu, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="flex flex-col items-center pt-1 shrink-0">
                          <div className="w-3 h-3 rounded-full bg-violet-500 ring-4 ring-violet-50" />
                          {i < data.education.length - 1 && <div className="w-px flex-1 mt-1 bg-violet-100 min-h-[28px]" />}
                        </div>
                        {editing ? (
                          <EditCard onRemove={() => set("education", data.education.filter((_, x) => x !== i))}>
                            <input
                              className="font-bold text-sm text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-violet-500 outline-none pb-1 pr-8 w-full transition-colors"
                              value={edu.degree} onChange={e => setEdu(i, "degree", e.target.value)} placeholder="Degree"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input className="text-xs text-slate-700 bg-white border border-slate-200 focus:border-violet-400 rounded-lg px-3 py-2 outline-none transition-colors"
                                value={edu.institution} onChange={e => setEdu(i, "institution", e.target.value)} placeholder="Institution" />
                              <input className="text-xs text-slate-700 bg-white border border-slate-200 focus:border-violet-400 rounded-lg px-3 py-2 outline-none transition-colors"
                                value={edu.date} onChange={e => setEdu(i, "date", e.target.value)} placeholder="e.g. 2012 – 2016" />
                            </div>
                          </EditCard>
                        ) : (
                          <div className="pb-1">
                            <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700">{edu.institution}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <Ic d={ICONS.clock} size={12} />{edu.date}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {editing && (
                      <AddBtn onClick={() => addArr("education", { degree: "", date: "", institution: "" })} label="Add Education" color="violet" />
                    )}
                  </div>
                </Section>
              </div>

              {/* ── Skills (tabbed) ──────────────────────────── */}
              <div className="anim-up d340">
                <Section icon="skills" label="Skills" accent="emerald">
                  {/* Tab Switcher */}
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-5">
                    {[
                      { key: "tech", label: "Technical", icon: ICONS.cpu, color: "text-blue-600" },
                      { key: "soft", label: "Soft Skills", icon: ICONS.heart, color: "text-rose-500" },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveSkillTab(tab.key)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeSkillTab === tab.key
                          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-slate-700"
                          }`}
                      >
                        <span className={activeSkillTab === tab.key ? tab.color : ""}>
                          <Ic d={tab.icon} size={13} />
                        </span>
                        {tab.label}
                        <span className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeSkillTab === tab.key ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-400"
                          }`}>
                          {tab.key === "tech" ? data.techSkills.length : data.softSkills.length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Technical Skills Panel */}
                  {activeSkillTab === "tech" && (
                    <div className="anim-in">
                      <p className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                        <Ic d={ICONS.cpu} size={12} /> Technical & Programming Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.techSkills.length === 0 && !editing && <p className="text-sm italic text-slate-400">No technical skills listed.</p>}
                        {data.techSkills.map((s, i) =>
                          editing ? (
                            <EditableSkill key={i} value={s} onChange={v => setArr("techSkills", i, v)} onRemove={() => removeArr("techSkills", i)} placeholder="e.g. React" />
                          ) : (
                            <SkillPill key={i} label={s} color="blue" />
                          )
                        )}
                        {editing && <AddBtn onClick={() => addArr("techSkills", "")} label="Add" color="blue" />}
                      </div>
                    </div>
                  )}

                  {/* Soft Skills Panel */}
                  {activeSkillTab === "soft" && (
                    <div className="anim-in">
                      <p className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                        <Ic d={ICONS.heart} size={12} /> Interpersonal & Soft Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.softSkills.length === 0 && !editing && <p className="text-sm italic text-slate-400">No soft skills listed.</p>}
                        {data.softSkills.map((s, i) =>
                          editing ? (
                            <EditableSkill key={i} value={s} onChange={v => setArr("softSkills", i, v)} onRemove={() => removeArr("softSkills", i)} placeholder="e.g. Leadership" />
                          ) : (
                            <SkillPill key={i} label={s} color="rose" />
                          )
                        )}
                        {editing && <AddBtn onClick={() => addArr("softSkills", "")} label="Add" color="rose" />}
                      </div>
                    </div>
                  )}
                </Section>
              </div>

              {/* ── Resume Upload (Like Image) ──────────────────── */}
              <div className="anim-up d400 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-2">
                <h2 className="text-[17px] font-bold text-slate-900 mb-1.5">Resume</h2>
                <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">Your resume is the first impression you make on potential employers. Craft it carefully to secure your desired job or internship.</p>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 mb-2 border-slate-300 transition-all flex flex-col items-center justify-center text-center 
                  ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-300 bg-white hover:bg-slate-50'}
                  ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {data.resumeLink ? (
                    <>
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 border border-blue-100 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.2)]">
                          <svg width="28" height="28" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path></svg>
                        </div>
                        <div className="text-center pointer-events-none">
                          <p className="text-sm font-bold text-slate-900">{dragActive ? "Drop PDF Here" : "Resume Attached"}</p>
                          <p className="text-xs text-slate-500 mt-1">{dragActive ? "Drag and drop to update" : "Visible to recruiters"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={data.resumeLink} target="_blank" rel="noreferrer" className="px-5 py-2 text-[13px] font-semibold rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
                          View PDF
                        </a>
                        {isOwnProfile && (
                          <label className="cursor-pointer px-5 py-2 text-[13px] font-semibold rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                            {uploading ? "Uploading..." : "Replace resume"}
                            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                          </label>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {isOwnProfile ? (
                        <label className={`cursor-pointer px-6 py-2 mb-2 text-[13px] font-semibold rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors ${dragActive ? 'bg-blue-50 ring-2 ring-blue-100' : ''}`}>
                          {uploading ? "Uploading..." : (dragActive ? "Drop PDF Here" : "Upload resume")}
                          <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                        </label>
                      ) : (
                        <div className="px-6 py-2 mb-2 text-[13px] font-semibold rounded-full border border-slate-300 text-slate-500">
                          No resume uploaded
                        </div>
                      )}
                      <p className="text-[12px] font-medium text-slate-400 mt-1 pointer-events-none">Supported formats: pdf, up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* ── Sidebar ───────────────────────────────────── */}
            <div className="anim-up d500 flex flex-col gap-4">

              {/* ATS Score */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">ATS Match Score</p>
                <div className="flex items-center justify-center my-4">
                  <AtsGauge score={data.atsScore} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-3">
                  {data.atsScore >= 80
                    ? "Profile is highly optimised for current roles."
                    : data.atsScore >= 60
                      ? "Good match — a few gaps to address."
                      : "Consider enriching this profile further."}
                </p>
              </div>



              {/* Quick Stats */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">Overview</p>
                <ul className="flex flex-col gap-3">
                  {[
                    { label: "Education", val: `${data.education.length} degree${data.education.length !== 1 ? "s" : ""}` },
                    { label: "Technical Skills", val: `${data.techSkills.length}` },
                    { label: "Soft Skills", val: `${data.softSkills.length}` },
                  ].map(({ label, val }) => (
                    <li key={label} className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-900">{val}</span>
                    </li>
                  ))}
                </ul>
              </div>


            </div>
          </div>
        </div>

        {/* ── Gallery Modal ─────────────────────────────────────── */}
        {gallery && (
          <div
            className="anim-in fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setGallery(false)}
          >
            <div
              className="anim-modal bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Choose Profile Picture</h2>
                <button
                  onClick={() => setGallery(false)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
                >
                  <Ic d={ICONS.x} size={13} />
                </button>
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { set("profilePicture", img); setGallery(false); }}
                    className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${data.profilePicture === img ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-blue-300"
                      }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={handleImgError}
                    />
                    {data.profilePicture === img && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <Ic d={ICONS.check} size={16} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Upload zone */}
              <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all text-slate-400 hover:text-blue-500">
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                {uploading ? (
                  <div className="anim-spin w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full" />
                ) : (
                  <>
                    <Ic d={ICONS.upload} size={22} />
                    <span className="text-xs font-semibold">Upload image</span>
                    <span className="text-xs text-slate-400">PNG or JPG · max 5 MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Profile Modal ────────────────────────────── */}
      {showDeleteModal && (
        <div
          onClick={() => !deletingProfile && setShowDeleteModal(false)}
          className="animate-[fadeIn_0.2s_ease_both] fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-[slideUp_0.25s_ease_both] w-full max-w-lg overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-2xl"
          >
            {/* Header with Gradient */}
            <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-600 shadow-sm transition-transform hover:scale-105">
                  <TriangleAlert size={20} className="shrink-0" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delete candidate profile?</h3>
                  <p className="text-sm text-slate-500">This is permanent and will remove your candidate profile data.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-6 py-5">
              {/* Target Hint */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-900">
                Type <span className="font-bold select-none whitespace-nowrap">delete profile</span> to confirm deletion.
              </div>

              {/* Confirmation Input */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Confirmation</span>
                <input
                  autoFocus
                  value={deleteConfirmationText}
                  onChange={e => setDeleteConfirmationText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && deleteConfirmationText === "delete profile" && !deletingProfile) {
                      handleDeleteProfile();
                    }
                  }}
                  autoComplete="off"
                  placeholder="delete profile"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100 shadow-inner"
                />
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!deletingProfile) {
                      setShowDeleteModal(false);
                      setDeleteConfirmationText("");
                    }
                  }}
                  disabled={deletingProfile}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:hidden"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  disabled={deleteConfirmationText !== "delete profile" || deletingProfile}
                  className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-700 hover:shadow-rose-500/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-rose-300"
                >
                  {deletingProfile ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-white/90 animate-pulse" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} className="shrink-0" /> Delete Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Candidate_Profile_View;