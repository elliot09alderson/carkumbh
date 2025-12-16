import { motion } from "framer-motion";
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
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Index = () => {
  useSmoothScroll();

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
      icon: Target,
      title: "Goal Setting",
      description:
        "Define clear objectives and create actionable roadmaps to achieve success.",
    },
    {
      icon: TrendingUp,
      title: "Marketing Strategy",
      description:
        "Innovative marketing approaches that amplify your brand presence.",
    },
    {
      icon: Rocket,
      title: "Startup Mentoring",
      description:
        "Navigate the entrepreneurial journey with expert guidance and support.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Lives Transformed" },
    { number: "500+", label: "Corporate Sessions" },
    { number: "15+", label: "Years Experience" },
    { number: "100+", label: "Companies Trained" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "CEO, TechVentures",
      content:
        "Toran Sir's coaching transformed our entire leadership approach. His insights are invaluable.",
      image: null,
    },
    {
      name: "Priya Sharma",
      role: "Entrepreneur",
      content:
        "The communication training was a game-changer for my business. Highly recommended!",
      image: null,
    },
    {
      name: "Amit Patel",
      role: "Director, Global Corp",
      content:
        "One of the most impactful training sessions our team has ever experienced.",
      image: null,
    },
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
            to="/upcoming-event"
            className="px-6 py-2 bg-gradient-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Upcoming Event
          </Link>
        </div>
        <Link
          to="/upcoming-event"
          className="md:hidden px-4 py-2 bg-gradient-primary text-primary-foreground rounded-full text-sm font-semibold"
        >
          Events
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative pt-20">
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
            className="pt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/upcoming-event">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-primary text-primary-foreground text-lg font-semibold rounded-full shadow-glow flex items-center gap-2 mx-auto"
              >
                Register for Event <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-primary/50 text-foreground text-lg font-semibold rounded-full flex items-center gap-2 mx-auto hover:bg-primary/10 transition-colors"
            >
              Learn More
            </motion.a>
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
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-secondary to-card overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                    <User className="w-16 h-16 text-primary-foreground" />
                  </div>
                </div>
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
                  15+
                </p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
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
                With over 15 years of experience in corporate training and
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
                    <p className="text-sm text-muted-foreground">ICF Certified</p>
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
                <p className="text-muted-foreground font-medium">{stat.label}</p>
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

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 relative"
              >
                <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                <p className="text-muted-foreground leading-relaxed mb-6 italic font-accent text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upcoming-event">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-primary text-primary-foreground text-lg font-semibold rounded-full shadow-glow flex items-center gap-2 mx-auto"
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
                  className="px-10 py-4 border border-primary/50 text-foreground text-lg font-semibold rounded-full flex items-center gap-2 mx-auto hover:bg-primary/10 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" /> Contact Us
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative pt-24 pb-8 px-4 border-t border-border/50">
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
                Empowering entrepreneurs and corporate leaders with transformative
                coaching, innovative strategies, and the mindset for success.
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
                    Indore, Madhya Pradesh, India
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
