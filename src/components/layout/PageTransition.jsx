import { motion } from 'framer-motion';

// Cortina negra editorial entre páginas.
export default function PageTransition({ children }) {
  return (
    <>
      <motion.main id="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        {children}
      </motion.main>
      <motion.div className="curtain" aria-hidden="true"
        initial={{ scaleY: 1, originY: 0 }} animate={{ scaleY: 0, originY: 0 }} exit={{ scaleY: 1, originY: 1 }}
        transition={{ duration: 0.35, ease: [0.7, 0, 0.2, 1] }} />
    </>
  );
}
