import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import CertificatesSection from "@/components/CertificatesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import IntroScreen from "@/components/IntroScreen";
import ScrollToTop from "@/components/ScrollToTop";
import SectionDivider from "@/components/SectionDivider";

// Plays the loading screen on initial page load / refresh,
// and skips it when navigating back within the SPA.
let hasPlayedIntroThisLoad = false;

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => !hasPlayedIntroThisLoad);
  const [contentEntered, setContentEntered] = useState(() => hasPlayedIntroThisLoad);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  const handleIntroComplete = useCallback(() => {
    hasPlayedIntroThisLoad = true;
    setContentEntered(true);
    setShowIntro(false);
  }, []);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Md. Faiad Mahmud Adil",
    alternateName: "It'z RJ",
    jobTitle: "Student Developer",
    url: "/",
    sameAs: [
      "https://www.facebook.com/itzrjhere/",
      "https://www.instagram.com/certified_valochele/",
      "https://github.com/itz-rj-here",
      "https://www.linkedin.com/in/itz-rj/",
    ],
  };

  return (
    <>
      <Helmet>
        <title>It'z RJ — Student Developer Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Md. Faiad Mahmud Adil (It'z RJ), a student developer from Dhaka building clean, modern web experiences with React, TypeScript, and Tailwind CSS."
        />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="It'z RJ — Student Developer Portfolio" />
        <meta
          property="og:description"
          content="Personal portfolio and project showcase of It'z RJ — student developer from Dhaka, Bangladesh."
        />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Helmet>

      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Header />
        <motion.main
          initial={showIntro ? { opacity: 0.35, y: 24, scale: 0.99 } : false}
          animate={
            contentEntered || !showIntro
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0.35, y: 24, scale: 0.99 }
          }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroSection />
          <SectionDivider />
          <AboutSection />
          <SectionDivider />
          <PortfolioSection />
          <SectionDivider />
          <SkillsSection />
          <SectionDivider />
          <CertificatesSection />
          <SectionDivider />
          <ContactSection />
        </motion.main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Index;
