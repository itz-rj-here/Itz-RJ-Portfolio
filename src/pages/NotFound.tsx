import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | It'z RJ</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center gradient-bg relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(211 78% 51% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(211 78% 51% / 0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-8xl md:text-[12rem] font-display font-bold gradient-text leading-none select-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            404
          </motion.p>

          <motion.p
            className="text-xl md:text-2xl text-foreground font-display font-semibold mt-4 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oops! Page not found
          </motion.p>

          <motion.p
            className="text-muted-foreground text-sm max-w-md mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" /> Return Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
