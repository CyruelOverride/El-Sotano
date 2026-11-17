import { motion } from 'framer-motion';

// Aparición progresiva al entrar en viewport. `delay` permite escalonar.
export default function Reveal({ children, delay = 0, as = 'div', className = '', y = 28 }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Comp>
  );
}
