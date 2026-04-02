import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";
import {
  Trash2,
  Eye,
  Star,
  Quote,
  MessageSquare,
  Search,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
} from "lucide-react";

/* ─── Design Tokens ─── */
const t = {
  bg: "#F9FAFB",
  surface: "#FFFFFF",
  border: "#E9D5FF",
  borderHov: "#C084FC",
  text: "#111827",
  muted: "#6B7280",
  accent: "#9b44fe",
  accentDim: "#F3E8FF",
  red: "#DC2626",
  redDim: "#FEE2E2",
  amber: "#F59E0B",
};

const PAGE_SIZE = 9; // cards per page

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("all"); // "all" | "1"–"5"
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ─── Fetch ─── */
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/testimonials");
      setTestimonials(res.data?.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* ─── Delete ─── */
  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/testimonials/${testimonialToDelete._id}`);
      setTestimonials((prev) =>
        prev.filter((t) => t._id !== testimonialToDelete._id)
      );
      toast.success("Testimonial deleted successfully");
      setIsDeleteModalOpen(false);
      setTestimonialToDelete(null);
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      toast.error("Failed to delete testimonial");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ─── Filter (search + stars) ─── */
  const filteredTestimonials = useMemo(() => {
    setCurrentPage(1); // reset page whenever filter changes
    return testimonials.filter((test) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        test.username.toLowerCase().includes(q) ||
        test.reviewmsg.toLowerCase().includes(q);
      const matchesStar =
        starFilter === "all" || test.rating === Number(starFilter);
      return matchesSearch && matchesStar;
    });
  }, [testimonials, searchTerm, starFilter]);

  /* ─── Pagination ─── */
  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / PAGE_SIZE));
  const paginatedTestimonials = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTestimonials.slice(start, start + PAGE_SIZE);
  }, [filteredTestimonials, currentPage]);

  /* ─── Modal helpers ─── */
  const handleOpenViewModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };
  const handleOpenDeleteModal = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteModalOpen(true);
  };

  /* ─── Sub-components ─── */
  const StarRating = ({ rating, size = 14 }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
  );

  /* Star filter options */
  const starOptions = [
    { value: "all", label: "All" },
    { value: "5", label: "⭐⭐⭐⭐⭐  5 Stars" },
    { value: "4", label: "⭐⭐⭐⭐  4 Stars" },
    { value: "3", label: "⭐⭐⭐  3 Stars" },
    { value: "2", label: "⭐⭐  2 Stars" },
    { value: "1", label: "⭐  1 Star" },
  ];

  /* Page buttons helper */
  const PaginationBtn = ({ page, active, onClick, children }) => (
    <button
      onClick={onClick}
      disabled={page === null}
      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all
        ${active
          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
          : "bg-white border border-slate-200 text-slate-600 hover:border-purple-400 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
        }`}
    >
      {children}
    </button>
  );

  /* Smart page number list: show first, last, current ±1, and ellipsis */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    return [...pages]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, []);
  }, [totalPages, currentPage]);

  /* ─── Render ─── */
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[#fdfbff]">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-1 rounded-full bg-purple-600" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-600">
                Feedback Management
              </span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Testimonials
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage and moderate platform user reviews.
            </p>
          </div>
          <button
            onClick={fetchTestimonials}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-600"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ─── Search, Filter & Stats ─── */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative w-full md:flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by user or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
            />
          </div>

          {/* ⭐ Star filter dropdown */}
          <div className="relative">
            <Filter
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-semibold text-slate-700 cursor-pointer"
              style={{ backgroundImage: "none" }}
            >
              {starOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* custom chevron */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {/* Active filter badge */}
          {starFilter !== "all" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setStarFilter("all")}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl hover:bg-amber-100 transition-all"
            >
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {starFilter}-Star only
              <X size={12} className="ml-0.5" />
            </motion.button>
          )}

          {/* Count badge */}
          <div className="ml-auto px-4 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider shrink-0">
            {filteredTestimonials.length} / {testimonials.length} Reviews
          </div>
        </div>

        {/* ─── Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2rem]" />
            ))
          ) : filteredTestimonials.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <MessageSquare size={48} className="opacity-20" />
              <p className="font-bold text-lg">No testimonials found</p>
              {starFilter !== "all" && (
                <button
                  onClick={() => setStarFilter("all")}
                  className="text-sm text-purple-600 font-bold underline underline-offset-2"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            paginatedTestimonials.map((test, i) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg">
                      {test.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 truncate max-w-[150px]">
                        {test.username}
                      </h3>
                      <StarRating rating={test.rating} />
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(test.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="relative flex-1">
                  <Quote
                    className="absolute -top-2 -left-2 text-purple-50 opacity-10 group-hover:opacity-20 transition-opacity"
                    size={40}
                  />
                  <p className="text-slate-600 text-sm font-medium line-clamp-3 leading-relaxed relative z-10 italic">
                    "{test.reviewmsg}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenViewModal(test)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-all text-xs font-black uppercase tracking-wider"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(test)}
                    className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* ─── Pagination ─── */}
        {!loading && filteredTestimonials.length > PAGE_SIZE && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 pt-2"
          >
            {/* Prev */}
            <PaginationBtn
              page={currentPage > 1 ? currentPage - 1 : null}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </PaginationBtn>

            {/* Page numbers */}
            {pageNumbers.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 font-bold text-sm select-none"
                >
                  …
                </span>
              ) : (
                <PaginationBtn
                  key={p}
                  page={p}
                  active={p === currentPage}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </PaginationBtn>
              )
            )}

            {/* Next */}
            <PaginationBtn
              page={currentPage < totalPages ? currentPage + 1 : null}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} />
            </PaginationBtn>
          </motion.div>
        )}

        {/* Page info label */}
        {!loading && filteredTestimonials.length > PAGE_SIZE && (
          <p className="text-center text-xs text-slate-400 font-medium -mt-4">
            Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filteredTestimonials.length} results
          </p>
        )}
      </div>

      {/* ─── View Modal ─── */}
      <AnimatePresence>
        {isModalOpen && selectedTestimonial && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-2xl font-black">
                      {selectedTestimonial.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">
                        {selectedTestimonial.username}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={selectedTestimonial.rating} size={16} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l pl-2 border-slate-200">
                          {new Date(selectedTestimonial.date).toDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <Quote
                    size={48}
                    className="absolute -top-4 -left-2 text-purple-600/10"
                  />
                  <p className="text-slate-700 text-lg font-medium leading-relaxed italic relative z-10">
                    "{selectedTestimonial.reviewmsg}"
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  Close Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {isDeleteModalOpen && testimonialToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-red-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Testimonial?</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">
                Are you sure you want to remove the review from{" "}
                <span className="text-slate-900 font-bold">
                  {testimonialToDelete.username}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;
