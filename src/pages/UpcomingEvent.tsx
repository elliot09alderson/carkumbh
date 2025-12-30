import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BookingForm from "@/components/BookingForm";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useState, useEffect } from "react";
import { getBanner } from "@/api/siteConfig";

const UpcomingEvent = () => {
  useSmoothScroll();
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

  return (
    <div className="min-h-screen bg-background relative">
       {/* Navigation / Header */}
       <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Link to="/" className="text-2xl font-bold font-heading">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Toran Sir</span>
        </Link>
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          Back to Home
        </Link>
      </nav>

      {/* Booking Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
             <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Upcoming Event
            </h1>
            <img
              src={bannerUrl || "/banner-evnt.jpeg"}
              alt="Event Banner"
              className="mx-auto mb-8 max-w-2xl w-full h-auto rounded-xl shadow-2xl border border-border/50"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Secure Your Entry
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us for an exclusive session designed to transform your business mindset.
            </p>
          </motion.div>

          <BookingForm />
        </div>
      </section>

       {/* Footer */}
       <footer className="py-8 px-4 border-t border-border/50 text-center text-muted-foreground">
          <p>© 2025 Toran Sir. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UpcomingEvent;
