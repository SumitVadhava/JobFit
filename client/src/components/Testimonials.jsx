import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import api from "../api/api";

const TestimonialComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        if (response.data && response.data.testimonials) {
          setReviews(response.data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="bg-white max-h-screen max-w-7xl mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          What Our Users Say
        </h2>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          <Marquee
            gradient={true}
            gradientColor={[244, 63, 94]}
            gradientWidth={100}
            speed={50}
            pauseOnHover={true}
            style={{ width: "100%", height: "auto" }}
          >
            {loading ? (
              <p className="text-center w-full py-4 text-gray-500">Loading testimonials...</p>
            ) : reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="flex-shrink-0 mx-8 px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 w-96 h-56 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-3">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-purple-600 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.285L12 18.629l-7.416 3.647 1.417-8.285-6.001-5.822 8.332-1.151z" />
                        </svg>
                      ))}
                      {[...Array(5 - (review.rating || 5))].map((_, i) => (
                        <svg
                          key={i + (review.rating || 5)}
                          className="w-5 h-5 text-gray-300 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.285L12 18.629l-7.416 3.647 1.417-8.285-6.001-5.822 8.332-1.151z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-sm line-clamp-4">
                      "{review.reviewmsg}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-purple-700 font-semibold" id="faq-section">
                        {review.username}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-full py-4 text-gray-500">No testimonials yet.</p>
            )}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default TestimonialComponent;