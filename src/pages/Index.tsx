import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import BookingForm from "@/components/BookingForm";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Car } from "lucide-react";

const Index = () => {
  useSmoothScroll();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Try to unmute video after 0.5 seconds
    const timer = setTimeout(() => {
      if (videoRef.current) {
        // Just unmute - don't call play() again since video is already playing
        videoRef.current.muted = false;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Video Section */}
      <section className="w-full h-[40vh] md:h-[50vh] overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="w-full h-full object-cover"
        >
          <source src="/horilal-trailer.mp4" type="video/mp4" />
        </video>
      </section>

      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-glow mb-6"
            >
              <Car className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Car Kumbh
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Experience the ultimate automotive gathering
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-8"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-primary"
              >
                <svg
                  className="w-6 h-6 mx-auto"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Booking Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Secure Your Entry
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose your package and complete your booking
              </p>
            </motion.div>

            <BookingForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 py-8 px-4 border-t border-border/50">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto text-center text-muted-foreground"
          >
            <p>© 2024 Car Kumbh. All rights reserved.</p>
            <p className="mt-2">
              <a href="/admin" className="text-primary hover:underline text-sm">
                Admin Access
              </a>
            </p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
