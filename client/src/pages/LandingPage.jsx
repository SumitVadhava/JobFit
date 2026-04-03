import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import KeyFeatures from "../components/KeyFeature";
import Testimonial from "../components/Testimonials";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import LandingPageSkeleton from "../components/LandingPageSkeleton";

const LandingPage = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Detect slow connection
        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
        if (
            connection &&
            ["slow-2g", "2g", "3g"].includes(connection.effectiveType)
        ) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LandingPageSkeleton />;
    }

    return (
        <section className="bg-white">
            <Hero />
            
            <div id="key-features">
                <KeyFeatures />
            </div>

            <div id="testimonials">
                <Testimonial />
            </div>

            <div id="faq">
                <FAQSection />
            </div>

            <div id="footer">
                <Footer />
            </div>
        </section>
    );
};

export default LandingPage;
