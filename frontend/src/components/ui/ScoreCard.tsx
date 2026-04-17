import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import ProgressBar from './ProgressBar';

interface ScoreCardProps {
  title: string;
  score: number;
  icon: IconType;
  color?: string;
  delay?: number;
}

export default function ScoreCard({ title, score, icon: Icon, color = 'var(--primary)', delay = 0 }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="glass-panel"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={22} color={color} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, fontFamily: 'var(--font-display)' }}>{title}</h3>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>
          {score}
        </div>
      </div>
      <ProgressBar progress={score} color={color} showLabel={false} height={6} />
    </motion.div>
  );
}
