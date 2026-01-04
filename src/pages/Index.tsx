import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import {
  User,
  Briefcase,
  Star,
  ChevronRight,
  Award,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  Play,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Quote,
  Mic,
  BookOpen,
  Rocket,
  X,
  ZoomIn,
  Megaphone,
  Home,
  Brain,
  Map,
  Trophy,
  Zap,
  ChevronDown,
  Sparkles,
  Menu,
  Smartphone,
  GraduationCap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Index = () => {
  useSmoothScroll();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: Briefcase,
      title: "Business Coaching",
      description:
        "Transform your business vision into reality with personalized coaching strategies.",
    },
    {
      icon: Mic,
      title: "Corporate Training",
      description:
        "Empower your team with cutting-edge skills and leadership development programs.",
    },
    {
      icon: MessageCircle,
      title: "Communication Mastery",
      description:
        "Master the art of persuasion and impactful communication that drives results.",
    },
    {
      icon: TrendingUp,
      title: "Marketing Strategy",
      description:
        "Innovative marketing approaches that amplify your brand presence.",
    },
    {
      icon: Smartphone,
      title: "Software Development & AI Solutions",
      description:
        "Build cutting-edge mobile apps and AI-powered applications with our expert IT services team.",
    },
    {
      icon: GraduationCap,
      title: "Training & Certification Program",
      description:
        "Get industry-recognized certifications and hands-on training to advance your career.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Lives Transformed" },
    { number: "50+", label: "Corporate Sessions" },
    { number: "5+", label: "Years Experience" },
    { number: "12+", label: "Companies Trained" },
  ];

  const testimonials = [
    {
      name: "Pitamber Patel",
      role: "Director, Rich Life International Pvt Ltd",
      content:
        "Toran Sir's coaching transformed our entire leadership approach. His insights are invaluable.",
      image: "/carkumbhtstimonials/pitamber.jpeg",
    },
    {
      name: "Prashant Singh",
      role: "Sales Manager, Hyundai",
      content:
        "The communication training was a game-changer for my career. Highly recommended!",
      image: "/carkumbhtstimonials/prashantsingh.jpeg",
      imagePosition: "center",
    },
    {
      name: "Dewa Sahu",
      role: "Sales Manager, AU Finance",
      content:
        "One of the most impactful training sessions our team has ever experienced.",
      image: "/carkumbhtstimonials/devasahu.jpeg",
      imagePosition: "center",
    },
    {
      name: "Krishna Patel",
      role: "Entrepreneur",
      content:
        "Toran Sir's guidance helped me build my business with confidence and clarity.",
      image: "/carkumbhtstimonials/kirshna.jpeg",
    },
    {
      name: "Horilala Markam",
      role: "Entrepreneur",
      content:
        "The training sessions gave me the skills and mindset to succeed as an entrepreneur.",
      image: "/carkumbhtstimonials/horilal.jpeg",
    },
    {
      name: "Mr. Lala Ram Patel",
      role: "Director, MLE Corporate Pvt. Ltd. India",
      content:
        "Working with Toran Sir has been a transformative experience for our organization.",
      image: "/lalaram.jpeg",
    },
    {
      name: "Mr. Mahendra Patel",
      role: "Director, MLE Corporate Pvt. Ltd. India",
      content:
        "Toran Sir's expertise and dedication have made a significant impact on our team's performance.",
      image: "/carkumbhtstimonials/mahendra.jpeg",
    },
    {
      name: "Ramesh Sinha",
      role: "Development Manager, SBI Life Insurance",
      content:
        "Toran Sir's training programs have been instrumental in enhancing our team's performance.",
      image: "/carkumbhtstimonials/RameshSinha.jpeg",
    },
  ];

  const galleryImages = [
    // "/images/grid/hero.jpg",
    "/images/grid/WhatsApp Image 2025-12-29 at 23.24.14.jpeg",
    "/images/grid/WhatsApp Image 2025-12-29 at 23.24.15 (1).jpeg",
    "/images/grid/WhatsApp Image 2025-12-29 at 23.24.15.jpeg",
  ];

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 glass-effect">
        <Link to="/" className="text-2xl font-bold font-heading">
          <span className="text-gradient">Toran Sir</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            className="text-foreground/80 hover:text-primary transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#services"
            className="text-foreground/80 hover:text-primary transition-colors font-medium"
          >
            Services
          </a>
          <a
            href="#testimonials"
            className="text-foreground/80 hover:text-primary transition-colors font-medium"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="text-foreground/80 hover:text-primary transition-colors font-medium"
          >
            Contact
          </a>
          <Link
            to="/certification-registration"
            className="px-5 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 text-foreground rounded-full font-semibold hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-500 transition-all duration-300 flex items-center gap-2"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            Learn Gen AI
          </Link>
          <Link
            to="/upcoming-event"
            className="px-6 py-2.5 bg-gradient-primary text-primary-foreground rounded-full font-bold hover:scale-105 hover:shadow-[0_0_20px_hsl(45_93%_47%_/_0.6)] transition-all duration-300 animate-pulse-fast flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Upcoming Event
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
            >
              <a
                href="#about"
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#services"
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#testimonials"
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Link
                to="/certification-registration"
                className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 text-foreground rounded-lg font-bold text-center flex items-center justify-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Brain className="w-5 h-5 text-purple-400" />
                Learn Gen AI
              </Link>
              <Link
                to="/upcoming-event"
                className="w-full py-3 bg-gradient-primary text-primary-foreground rounded-lg font-bold text-center flex items-center justify-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Upcoming Event
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Marquee Offer Banner */}
      <Link 
        to="/certification-registration"
        className="fixed top-[88px] left-0 right-0 z-30 bg-gradient-to-r from-purple-600 via-primary to-purple-600 py-2.5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-3 text-white font-semibold">
              <span className="text-lg">🧠</span>
              Learn Gen AI for FREE
              <span className="text-yellow-300">•</span>
              <span className="text-lg">🏆</span>
              Get a chance to win
              <span className="text-yellow-300 font-bold text-lg">₹50,000</span>
              <span className="text-yellow-300">•</span>
              <span className="text-lg">🚀</span>
              Register Now!
              <span className="text-yellow-300 mx-4">★</span>
            </span>
          ))}
        </div>
      </Link>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative pt-40 md:pt-44">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
        </div>

        {/* Decorative Lines */}
        <div className="absolute left-8 top-1/3 hidden lg:block">
          <div className="artistic-line-vertical" />
        </div>
        <div className="absolute right-8 bottom-1/3 hidden lg:block">
          <div className="artistic-line-vertical" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 z-10 max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary font-accent text-xl md:text-2xl italic tracking-wide"
          >
            Business Coach & Corporate Trainer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight font-heading"
          >
            <span className="text-gradient-light">Toran</span>
            <span className="text-gradient"> Sir</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="artistic-line w-32" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
          >
            Empowering future entrepreneurs and corporate leaders with master
            communication skills, innovative marketing strategies, and
            transformative leadership principles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/upcoming-event">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-primary text-primary-foreground text-lg font-semibold rounded-full shadow-glow flex items-center gap-2"
              >
                Register for Event <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/certification-registration">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-foreground text-lg font-semibold rounded-full flex items-center gap-2 hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500 transition-all"
              >
                <Brain className="w-5 h-5 text-purple-400" />
                Learn Gen AI
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>


      {/* Image Banner */}
      <section className="py-4 px-4">
        <Link to="/certification-registration">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="max-w-5xl mx-auto"
          >
            <div className="rounded-3xl electric-border glow-pulse cursor-pointer">
              <div className="rounded-3xl overflow-hidden shimmer bg-card relative z-10">
                <img
                  src="/images/banners/image.png"
                  alt="Banner"
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
        </Link>
      </section>



      {/* About Section */}
      <section id="about" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image/Visual Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative max-w-[463px]"
            >
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-secondary to-card overflow-hidden relative">
                <img
                  src="/abt-flip-x.jpeg"
                  alt="Toran Sir"
                  className="w-full h-full object-cover"
                />
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 border border-primary/30 rounded-full" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border border-primary/20 rounded-full" />
              </div>
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-card p-6 rounded-2xl shadow-elevated border border-border/50"
              >
                <p className="text-4xl font-bold text-gradient font-heading">
                  5+
                </p>
                <p className="text-sm text-muted-foreground">
                  Years Experience
                </p>
              </motion.div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <p className="text-primary font-accent text-lg italic mb-2">
                  About Me
                </p>
                <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                  Transforming Lives Through{" "}
                  <span className="text-gradient">Mentorship</span>
                </h2>
                <div className="artistic-line mb-8" />
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                With over 5 years of experience in corporate training and
                business coaching, I have dedicated my life to empowering
                individuals and organizations to reach their full potential.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                My approach combines time-tested wisdom with modern strategies,
                helping entrepreneurs build sustainable businesses and
                professionals become influential leaders in their fields.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Certified Coach</p>
                    <p className="text-sm text-muted-foreground">Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Author</p>
                    <p className="text-sm text-muted-foreground">
                      Published Works
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-accent text-lg italic mb-2">
              Impact & Results
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading">
              Numbers That <span className="text-gradient">Speak</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-5xl md:text-6xl font-bold text-gradient font-heading mb-2">
                  {stat.number}
                </p>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-accent text-lg italic mb-2">
              What I Offer
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Services & <span className="text-gradient">Expertise</span>
            </h2>
            <div className="artistic-line mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions designed to accelerate your growth and
              transform your potential into achievement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover-lift"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-4 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-accent text-lg italic mb-2">
              Moments
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Gallery <span className="text-gradient">Highlights</span>
            </h2>
            <div className="artistic-line mx-auto" />
          </motion.div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group rounded-2xl overflow-hidden shadow-lg border border-border/50 break-inside-avoid cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    image.includes("hero.jpg") ? "aspect-[3/4]" : "h-auto"
                  }`}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 delay-75" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={selectedImage}
                alt="Gallery full view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Who Should Attend Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Who Should <span className="text-gradient">Attend</span>
            </h2>
            <div className="artistic-line mx-auto mb-8" />
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              This summit is for anyone who wants{" "}
              <span className="text-primary font-semibold">2026</span> to be a{" "}
              <span className="text-primary font-semibold">
                breakthrough year
              </span>
              :
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {[
              {
                icon: User,
                label: "Entrepreneurs",
                desc: "Scale your vision and build a legacy.",
              },
              {
                icon: Briefcase,
                label: "Working Professionals",
                desc: "Accelerate your career trajectory.",
              },
              {
                icon: Users,
                label: "Coaches & Trainers",
                desc: "Amplify your impact and authority.",
              },
              {
                icon: Megaphone,
                label: "Digital Creators",
                desc: "Monetize your influence effectively.",
              },
              {
                icon: Home,
                label: "Homemakers",
                desc: "Empower yourself with financial freedom.",
              },
              {
                icon: Brain,
                label: "Growth Seekers",
                desc: "Anyone desiring clarity & strong mindset.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card/30 backdrop-blur-sm border border-border/40 overflow-hidden rounded-2xl p-8 group relative transition-all duration-300 hover:border-primary/50 hover:bg-card/50"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <item.icon className="w-24 h-24 text-primary rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-background border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors shadow-lg">
                    <item.icon className="w-7 h-7 text-primary/80 group-hover:text-primary transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-primary transition-colors mb-2">
                      {item.label}
                    </h3>
                    <p className="text-muted-foreground/80 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="w-8 h-1 bg-primary/20 group-hover:w-full group-hover:bg-primary transition-all duration-500 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What This Summit Will Give You Section */}
      <section className="py-24 px-4 bg-background relative overflow-hidden border-t border-white/5">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                The Blueprint For Your <br />{" "}
                <span className="text-gradient">2026 Evolution</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-transparent" />

              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                This isn't just another seminar. It's an{" "}
                <span className="text-primary font-semibold">
                  architecture session
                </span>{" "}
                for your future.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Most people start the year with vague resolutions. We ensure you
                start with a battle-tested strategy. We strip away the fluff to
                give you the raw, tactical playbooks that industry titans use to
                dominate.
              </p>

              <div className="flex flex-col gap-4 text-sm text-primary/80 font-medium uppercase tracking-widest pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Tactical Frameworks
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Science-Backed Protocols
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  High-Impact Networking
                </div>
              </div>
            </motion.div>

            {/* Right Accordion */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  id: 0,
                  icon: Map,
                  title: "Strategic 2026 Roadmap",
                  content:
                    "Stop living by guesswork. We'll build a precision-engineered timeline for your personal and professional evolution, ensuring every month of 2026 moves the needle toward your ultimate vision.",
                },
                {
                  id: 1,
                  icon: Trophy,
                  title: "High-Impact Leadership",
                  content:
                    "Command the room. Learn the psychological frameworks used by top CEOs to influence teams, negotiate high-stakes deals, and build unwavering authority in any environment.",
                },
                {
                  id: 2,
                  icon: Zap,
                  title: "Cognitive Mastery & Flow",
                  content:
                    "Unlock your brain's hidden gear. Master the protocols to banish brain fog, sustain deep focus, and operate at peak performance on demand, regardless of external chaos.",
                },
                {
                  id: 3,
                  icon: Rocket,
                  title: "What Happens After Registration?",
                  content:
                    "You will immediately receive your Summit Entry Pass via email. Additionally, you'll be redirected to join our VIP WhatsApp Mastermind where the pre-event networking begins. Your Strategic Workbook will be delivered 48 hours prior to the event.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    activeAccordion === index
                      ? "bg-card/40 border-primary/50 shadow-glow/10"
                      : "bg-card/20 border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === index ? null : index
                      )
                    }
                    className="w-full p-6 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          activeAccordion === index
                            ? "bg-primary text-primary-foreground shadow-glow"
                            : "bg-secondary text-muted-foreground group-hover:text-primary"
                        }`}
                      >
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3
                        className={`text-xl font-bold font-heading transition-colors ${
                          activeAccordion === index
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeAccordion === index
                          ? "rotate-180 text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pl-[5.5rem] text-muted-foreground leading-relaxed">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-32 px-4 bg-gradient-to-b from-background via-secondary/20 to-background relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-accent text-lg italic mb-2">
              Client Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              What People <span className="text-gradient">Say</span>
            </h2>
            <div className="artistic-line mx-auto" />
          </motion.div>

          {/* Infinite Marquee Container */}
          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="flex gap-8 w-max animate-marquee pb-4 pl-4">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="w-[300px] md:w-[400px] flex-shrink-0 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 relative hover:border-primary/50 transition-colors group"
                >
                  <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6 group-hover:text-primary/40 transition-colors" />
                  <p className="text-muted-foreground leading-relaxed mb-6 italic font-accent text-lg">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className={`w-12 h-12 rounded-full object-cover shadow-lg ${
                          testimonial.imagePosition === "center"
                            ? "object-center"
                            : "object-top"
                        }`}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-primary/80">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Quote className="w-16 h-16 text-primary/30 mx-auto mb-8" />
            <p className="text-3xl md:text-4xl font-accent italic text-foreground/90 leading-relaxed mb-8">
              "Success is not just about what you accomplish in your life, it's
              about what you inspire others to do."
            </p>
            <div className="artistic-line mx-auto mb-4" />
            <p className="text-primary font-heading text-xl">- Toran Sir</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-card via-secondary/50 to-card border border-border/50 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Ready to <span className="text-gradient">Transform</span> Your
                Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                Join thousands who have already taken the first step towards
                their success. Register for our upcoming event and start your
                transformation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/upcoming-event">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-primary text-primary-foreground text-lg font-semibold rounded-full shadow-glow flex items-center gap-2"
                  >
                    Register Now <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <motion.a
                  href="https://wa.me/916264824626"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border border-primary/50 text-foreground text-lg font-semibold rounded-full flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" /> Contact Us
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="relative pt-24 pb-8 px-4 border-t border-border/50"
      >
        {/* Footer Top - Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block mb-6">
                <h3 className="text-3xl font-bold font-heading text-gradient">
                  Toran Sir
                </h3>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Empowering entrepreneurs and corporate leaders with
                transformative coaching, innovative strategies, and the mindset
                for success.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold font-heading mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <Link
                    to="/upcoming-event"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Upcoming Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold font-heading mb-6">
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-muted-foreground">+91 6264824626</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-muted-foreground">
                    contact@toransir.com
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-muted-foreground">
                    Parpoda, Bemetara Road,
                    <br />
                    District Bemetara,
                    <br />
                    Chhattisgarh - 491993
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-muted-foreground text-sm">
                © 2025 Toran Sir. All rights reserved.
              </p>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/refund-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
                <Link
                  to="/terms-conditions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
