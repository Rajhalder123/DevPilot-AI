import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, color = 'var(--primary)', height = 8, showLabel = true }: ProgressBarProps) {
  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--muted)' }}>Progress</span>
          <span style={{ color }}>{progress}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: height / 2,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: height / 2,
            boxShadow: `0 0 10px ${color}80`
          }}
        />
      </div>
    </div>
  );
}
