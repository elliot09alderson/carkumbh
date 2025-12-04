import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookingForm from "@/components/BookingForm";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Car, Volume2, VolumeX } from "lucide-react";
import { getBanner } from "@/api/siteConfig";
import { FaWhatsapp } from "react-icons/fa";

const Index = () => {
  useSmoothScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const data = await getBanner();
        if (data.bannerUrl) {
          setBannerUrl(data.bannerUrl);
        }
      } catch (error) {
        console.error("Failed to load banner", error);
      }
    };
    loadBanner();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Video Section - Commented out for now
      <section className="w-full h-[40vh] md:h-[80vh] overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-fit lg:object-cover"
        >
          <source src="/horilal-trailer.mp4" type="video/mp4" />
        </video>

        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>
      </section>
      */}

      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-[40vh] md:min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20 bg-background">
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
              <img
                src={bannerUrl || "/eventBanner.jpeg"}
                alt="Car Kumbh Event Banner"
                className="mx-auto mb-8 max-w-full h-auto rounded-lg shadow-lg"
              />
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
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Link
                to="/refund-policy"
                className="text-sm hover:text-primary transition-colors"
              >
                Refund Policy
              </Link>
              <span className="text-border">|</span>
              <Link
                to="/terms-conditions"
                className="text-sm hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
              <span className="text-border">|</span>
              <Link
                to="/privacy-policy"
                className="text-sm hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
            <p>© 2025 Car Kumbh. All rights reserved.</p>
          </motion.div>
        </footer>
      </div>
      
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/916264824626"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8" />
      </a>
    </div>
  );
};

export default Index;
