import { useState, useEffect, useCallback, useMemo } from "react";
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
import { usePortfolioData } from "@/hooks/use-portfolio";

// Plays the loading screen on initial page load / refresh,
// and skips it when navigating back within the SPA.
let hasPlayedIntroThisLoad = false;

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => !hasPlayedIntroThisLoad);
  const [contentEntered, setContentEntered] = useState(() => hasPlayedIntroThisLoad);
  const { data } = usePortfolioData();
  const { projects, about, socialLinks, skillCategories } = data;

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

  // Dynamically compute SEO metadata & JSON-LD from Supabase portfolio data
  const seoMetadata = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://itzrj.vercel.app";
    const canonicalUrl = `${origin}/`;

    const featuredProjectTitles = projects
      .slice(0, 3)
      .map((p) => p.seoTitle || p.title)
      .join(", ");

    const pageTitle = `${about.fullName} (${about.subtitle.replace("aka ", "")}) — Developer Portfolio`;

    const rawDescription = featuredProjectTitles
      ? `Portfolio of ${about.fullName} (${about.subtitle}). Explore ${projects.length}+ projects including ${featuredProjectTitles}, built with React, TypeScript & Tailwind CSS.`
      : `Portfolio of ${about.fullName} (${about.subtitle}), a developer from ${about.location} building modern web experiences with React and TypeScript.`;

    const metaDescription = rawDescription.slice(0, 160);

    // Primary social sharing preview image (featured project cover or profile portrait)
    const primaryOgImage =
      projects[0]?.image ||
      about.aboutImages[0]?.src ||
      "https://i.ibb.co.com/gMdpT7xc/pfp.png";

    // Aggregate keywords across projects & skills for search engine indexing
    const allKeywords = Array.from(
      new Set([
        about.fullName,
        "It'z RJ",
        "Portfolio",
        ...projects.flatMap((p) => [
          p.seoTitle || p.title,
          ...(p.seoKeywords || []),
          ...p.technologies,
        ]),
        ...skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
      ])
    ).join(", ");

    const sameAsUrls = socialLinks
      .filter((s) => s.url.startsWith("http"))
      .map((s) => s.url);

    // Rich Schema.org Graph: Person + ItemList of every Supabase project with its SEO fields
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${origin}/#person`,
          name: about.fullName,
          alternateName: "It'z RJ",
          jobTitle: about.heroRoles?.[0] || "Student Developer",
          description: about.heroBio || metaDescription,
          image: about.aboutImages[0]?.src,
          url: canonicalUrl,
          address: {
            "@type": "PostalAddress",
            addressLocality: about.location || "Dhaka, Bangladesh",
          },
          sameAs: sameAsUrls,
        },
        {
          "@type": "ItemList",
          "@id": `${origin}/#projects`,
          name: "Featured Portfolio Projects",
          description: `Projects engineered and maintained by ${about.fullName}`,
          numberOfItems: projects.length,
          itemListElement: projects.map((project, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
              "@type": "CreativeWork",
              "@id": `${origin}/project/${project.id}`,
              name: project.seoTitle || project.title,
              headline: project.seoTitle || project.title,
              description: project.seoDescription || project.shortDescription,
              image: project.image,
              url: project.liveUrl || `${origin}/project/${project.id}`,
              keywords: (project.seoKeywords?.length
                ? project.seoKeywords
                : project.technologies
              ).join(", "),
              author: {
                "@id": `${origin}/#person`,
              },
            },
          })),
        },
      ],
    };

    return {
      pageTitle,
      metaDescription,
      canonicalUrl,
      primaryOgImage,
      allKeywords,
      structuredData,
    };
  }, [projects, about, socialLinks, skillCategories]);

  return (
    <>
      <Helmet>
        <title>{seoMetadata.pageTitle}</title>
        <meta name="description" content={seoMetadata.metaDescription} />
        <meta name="keywords" content={seoMetadata.allKeywords} />
        <meta name="author" content={about.fullName} />
        <link rel="canonical" href={seoMetadata.canonicalUrl} />

        {/* OpenGraph Social Sharing Preview Cards */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={`${about.fullName} Portfolio`} />
        <meta property="og:title" content={seoMetadata.pageTitle} />
        <meta property="og:description" content={seoMetadata.metaDescription} />
        <meta property="og:url" content={seoMetadata.canonicalUrl} />
        <meta property="og:image" content={seoMetadata.primaryOgImage} />
        <meta property="og:image:alt" content={projects[0]?.title || about.fullName} />

        {/* Additional OpenGraph images for each project fetched from Supabase */}
        {projects.slice(1, 5).map((proj) =>
          proj.image ? (
            <meta key={`og-img-${proj.id}`} property="og:image" content={proj.image} />
          ) : null
        )}

        {/* Twitter / X Large Preview Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMetadata.pageTitle} />
        <meta name="twitter:description" content={seoMetadata.metaDescription} />
        <meta name="twitter:image" content={seoMetadata.primaryOgImage} />

        {/* Per-Project Dynamic Meta Descriptors for Crawlers */}
        {projects.map((proj, index) => (
          <meta
            key={`proj-seo-${proj.id}`}
            name={`portfolio:project:${index + 1}`}
            content={`${proj.seoTitle || proj.title} — ${
              proj.seoDescription || proj.shortDescription
            } (${proj.technologies.join(", ")})`}
          />
        ))}

        {/* Schema.org JSON-LD Graph (Person + All Supabase Projects) */}
        <script type="application/ld+json">
          {JSON.stringify(seoMetadata.structuredData)}
        </script>
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
