import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  emoji?: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function PageHeader({ eyebrow, emoji, title, subtitle, children }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white px-6 py-8 md:px-10 md:py-10">

      {/* Blobs de fondo */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/2 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-400 rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-harvest-400/20 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-300/10 rounded-full blur-2xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-5xl"
      >
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white/85 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {emoji && <span>{emoji}</span>} {eyebrow}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight text-balance">
          {title}
        </h1>
        <p className="text-white/70 mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
        {children}
      </motion.div>
    </section>
  );
}
