import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdSlides, AdSlide } from '@/api/siteConfig';

const INTERVAL_MS = 4000;

export default function AdSlider() {
  const [slides, setSlides] = useState<AdSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getAdSlides().then((data) => setSlides(data)).catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length, paused, next]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const isExternal = slide.navigationUrl.startsWith('http');

  const inner = (
    <motion.div
      className="rounded-3xl electric-border glow-pulse cursor-pointer"
      whileHover={{ scale: 1.01 }}
    >
      <div className="rounded-3xl overflow-hidden shimmer bg-card relative z-10">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.id}
            src={slide.imageUrl}
            alt="Ad Banner"
            className="w-full h-auto object-cover"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <section className="py-4 px-4">
      <div
        className="max-w-5xl mx-auto relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {isExternal ? (
          <a href={slide.navigationUrl} target="_blank" rel="noopener noreferrer">{inner}</a>
        ) : (
          <Link to={slide.navigationUrl}>{inner}</Link>
        )}

        {/* Prev / Next arrows — only show if multiple slides */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot navigation */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
