import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import KeyFeatures from "../components/KeyFeature";
import Testimonial from "../components/Testimonials";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import LandingPageSkeleton from "../components/LandingPageSkeleton";

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

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
        <section className="bg-white overflow-hidden">
            <div id="home">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <Hero />
                </motion.div>
            </div>
            
            <div id="key-features">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <KeyFeatures />
                </motion.div>
            </div>

            <div id="user-review">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <Testimonial />
                </motion.div>
            </div>

            <div id="faq-section">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <FAQSection />
                </motion.div>
            </div>

            <div id="footer">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <Footer />
                </motion.div>
            </div>
        </section>
    );

};

export default LandingPage;

