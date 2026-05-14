import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";

const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-12" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-lg gradient-text">It'z RJ</p>
            <p className="text-muted-foreground text-sm mt-1">Building the future, one line at a time.</p>
          </div>

          <div className="flex gap-6">
            {["Home", "About", "Skills", "Portfolio", "Contact"].map((item, i) => (
              <motion.button
                key={item}
                onClick={() => scrollTo(`#${item.toLowerCase()}`)}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 pt-6 border-t border-border/50 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
            © {new Date().getFullYear()} It'z RJ. Made with
            <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" />
            All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
