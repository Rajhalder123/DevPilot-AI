import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';

interface UploadBoxProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  title?: string;
  subtitle?: string;
}

export default function UploadBox({ 
  file, 
  onFileSelect, 
  accept = { 'application/pdf': ['.pdf'] }, 
  maxSize = 5 * 1024 * 1024,
  title = "Drag & drop your file",
  subtitle = "PDF format, max 5MB"
}: UploadBoxProps) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-panel ${isDragActive ? 'active-drop' : ''}`}
      style={{
        border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border-color)'}`,
        padding: '60px 40px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--card)',
        transition: 'all 0.3s ease',
        marginBottom: 24,
      }}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ y: isDragActive ? -10 : 0, scale: isDragActive ? 1.05 : 1 }}
      >
        <FiUploadCloud size={56} color={isDragActive ? 'var(--primary)' : 'var(--muted)'} style={{ marginBottom: 16, margin: '0 auto' }} />
      </motion.div>
      
      {file ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <FiFileText size={20} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--foreground)' }}>{file.name}</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{(file.size / 1024).toFixed(1)} KB — Click or drop to replace</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--foreground)' }}>
            {isDragActive ? 'Drop your file here...' : title}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{subtitle}</p>
        </motion.div>
      )}
    </div>
  );
}
