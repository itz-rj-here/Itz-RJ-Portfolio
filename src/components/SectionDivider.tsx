import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SectionDivider = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="container mx-auto px-4 md:px-8">
      <motion.div
        className="section-divider"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
};

export default SectionDivider;
