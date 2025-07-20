import React from "react";
import Marquee from "react-fast-marquee";

const UserReviewSection = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Software Developer",
      rating: 5,
      comment:
        "This job portal helped me land my dream job at Google in just two weeks! The ATS score feature was a game-changer.",
      date: "July 10, 2025",
    },
    {
      name: "Rahul Mehta",
      role: "Data Analyst",
      rating: 4,
      comment:
        "Easy to use interface and great job matching. I wish the resume upload process was a bit faster, but overall excellent!",
      date: "July 5, 2025",
    },
    {
      name: "Sneha Kapoor",
      role: "HR Manager",
      rating: 5,
      comment:
        "As a recruiter, I love how quickly I can find qualified candidates. The dashboard is intuitive and efficient.",
      date: "July 2, 2025",
    },
  ];

  return (
    <div className="bg-white max-h-screen max-w-7xl mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          What Our Users Say
        </h2>
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          <Marquee
            gradient={true}
            gradientColor={[244, 63, 94]} // Attractive pinkish gradient
            gradientWidth={100}
            speed={50}
            pauseOnHover={true}
            style={{ width: "100%", height: "auto" }} // Ensures full width without overflow
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 w-96"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-purple-600 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.285L12 18.629l-7.416 3.647 1.417-8.285-6.001-5.822 8.332-1.151z" />
                    </svg>
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <svg
                      key={i + review.rating}
                      className="w-5 h-5 text-gray-300 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.285L12 18.629l-7.416 3.647 1.417-8.285-6.001-5.822 8.332-1.151z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic text-sm">
                  "{review.comment}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 font-semibold">
                      {review.name}
                    </p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                  </div>
                  <p className="text-gray-400 text-xs">{review.date}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default UserReviewSection;
