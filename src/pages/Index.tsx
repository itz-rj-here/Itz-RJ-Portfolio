import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import CertificatesSection from "@/components/CertificatesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import IntroScreen from "@/components/IntroScreen";

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

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      {ready && (
        <div className="min-h-screen">
          <Header />
          <main>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <PortfolioSection />
            <CertificatesSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Index;
