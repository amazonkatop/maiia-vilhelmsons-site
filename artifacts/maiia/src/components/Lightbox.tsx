import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  alt: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ images, currentIndex, alt, onClose, onPrev, onNext }: LightboxProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button
          className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Counter */}
        <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase">
          {currentIndex + 1} / {images.length}
        </p>

        {/* Prev */}
        {images.length > 1 && (
          <button
            className="absolute left-6 text-white/50 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>
        )}

        {/* Image */}
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          src={images[currentIndex]}
          alt={`${alt} — ${currentIndex + 1}`}
          className="max-h-[88vh] max-w-[90vw] object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Next */}
        {images.length > 1 && (
          <button
            className="absolute right-6 text-white/50 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); /* handled by parent */ }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white w-4' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
