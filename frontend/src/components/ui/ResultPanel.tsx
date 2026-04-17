import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface ResultPanelProps {
  title: string;
  icon: IconType;
  iconColor?: string;
  children: ReactNode;
  delay?: number;
}

export default function ResultPanel({ title, icon: Icon, iconColor = 'var(--primary)', children, delay = 0 }: ResultPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel"
      style={{ padding: '28px', height: '100%' }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--foreground)' }}>
        <Icon size={22} color={iconColor} />
        {title}
      </h3>
      <div style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
        {children}
      </div>
    </motion.div>
  );
}
