import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
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

const Index = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setReady(true);
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
        <meta property="og:description" content="Personal portfolio and project showcase of It'z RJ — student developer from Dhaka, Bangladesh." />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Helmet>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      {ready && (
        <div className="min-h-screen">
          <Header />
          <main>
            <HeroSection />
            <SectionDivider />
            <AboutSection />
            <SectionDivider />
            <SkillsSection />
            <SectionDivider />
            <PortfolioSection />
            <SectionDivider />
            <CertificatesSection />
            <SectionDivider />
            <ContactSection />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </>
  );
};

export default Index;
