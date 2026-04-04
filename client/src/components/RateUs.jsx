import React, { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContexts";
import { toast } from "react-toastify";

const RateUs = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a short review message.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/testimonials", {
        username: user?.userName || user?.name || "Anonymous User",
        rating: rating,
        reviewmsg: message.trim(),
      });
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          Rate Your Experience
          <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Feedback
          </span>
        </h3>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-slate-500">How would you rate JobFit?</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform duration-150 active:scale-90"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <Star
                        size={28}
                        className={`transition-colors duration-200 ${
                          (hover || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Share your thoughts
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What do you like most about our platform?"
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[100px] outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed group"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Submit Review
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Feedback Submitted!</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-[240px]">
                We appreciate your review. Your feedback helps us improve for everyone.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                  setMessage("");
                }}
                className="mt-6 text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
              >
                Submit another review
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RateUs;
