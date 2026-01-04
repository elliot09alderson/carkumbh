import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Code,
  Brain,
  ArrowRight,
  CheckCircle,
  User,
  Phone,
  BookOpen,
  Briefcase,
  Sparkles,
  Trophy,
  Calendar,
  Clock,
  Gift,
  Star,
  Zap,
  Target,
  Award,
  ChevronDown,
  Users,
  Play,
  Laptop,
  Rocket,
  Home,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getWorkshopBanner, getWorkshopContent, WorkshopContent } from "@/api/siteConfig";

interface FormData {
  studentName: string;
  whatsappNumber: string;
  highestQualification: string;
  workingInIT: string;
}

const CertificationRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    whatsappNumber: "",
    highestQualification: "",
    workingInIT: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Dynamic content from API
  const [workshopBanner, setWorkshopBanner] = useState<string | null>(null);
  const [workshopContentData, setWorkshopContentData] = useState<WorkshopContent>({
    title: '7-Day Gen AI & Vibe Coding Workshop',
    subtitle: 'Master the future of coding with AI. Learn, Build, and Win!',
    prizeAmount: '50000',
    isFree: true,
    whatsappGroupLink: 'https://chat.whatsapp.com/Eu63xdXtVaj8sFBCyLDfZa',
  });
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    loadWorkshopData();
  }, []);

  const loadWorkshopData = async () => {
    try {
      setIsLoadingContent(true);
      const [bannerData, contentData] = await Promise.all([
        getWorkshopBanner().catch(() => ({ bannerUrl: null })),
        getWorkshopContent().catch(() => ({
          title: '7-Day Gen AI & Vibe Coding Workshop',
          subtitle: 'Master the future of coding with AI. Learn, Build, and Win!',
          prizeAmount: '50000',
          isFree: true,
          whatsappGroupLink: 'https://chat.whatsapp.com/Eu63xdXtVaj8sFBCyLDfZa',
        })),
      ]);
      setWorkshopBanner(bannerData.bannerUrl);
      setWorkshopContentData(contentData);
    } catch (error) {
      console.error('Failed to load workshop data', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const qualifications = [
    "10th Pass",
    "12th Pass",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Other",
  ];

  const workshopDays = [
    { day: 1, topic: "Introduction to Generative AI & Prompt Engineering", icon: Brain },
    { day: 2, topic: "Building AI-Powered Applications", icon: Rocket },
    { day: 3, topic: "Vibe Coding Fundamentals", icon: Code },
    { day: 4, topic: "Advanced AI Integration Techniques", icon: Zap },
    { day: 5, topic: "Real-World Project Development", icon: Laptop },
    { day: 6, topic: "AI Tools & Automation Mastery", icon: Target },
    { day: 7, topic: "Final Project + Quiz Prep", icon: Trophy },
  ];

  const faqs = [
    {
      question: "Is this workshop really FREE?",
      answer: "Yes! 100% FREE. No hidden charges, no payment required. We believe in empowering everyone with AI skills. Just register and join!",
    },
    {
      question: "Who can participate in the quiz competition?",
      answer: "Anyone who attends the 7-day workshop can participate. The quiz questions will be based on what you learn during the workshop, so attending all sessions gives you the best chance to win!",
    },
    {
      question: "How will the ₹50,000 prize be distributed?",
      answer: "The prize pool will be distributed among the TOP 5 scorers! 1st Place: ₹25,000 | 2nd Place: ₹10,000 | 3rd Place: ₹8,000 | 4th Place: ₹4,000 | 5th Place: ₹3,000. All prizes will be transferred directly to your bank account!",
    },
    {
      question: "Do I need prior coding experience?",
      answer: "No prior experience required! This workshop is designed for beginners and intermediate learners. We'll start from the basics and build up to advanced concepts.",
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes! Every participant who completes the 7-day workshop will receive a verified digital certificate that you can add to your LinkedIn profile and resume.",
    },
    {
      question: "What is Vibe Coding?",
      answer: "Vibe Coding is the future of development - using AI assistants to write code faster and smarter. You'll learn to build applications 10x faster using cutting-edge AI tools.",
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Name is required";
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Please enter a valid 10-digit Indian mobile number";
    }

    if (!formData.highestQualification) {
      newErrors.highestQualification = "Please select your qualification";
    }

    if (!formData.workingInIT) {
      newErrors.workingInIT = "Please select an option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsRegistered(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-10 relative overflow-hidden">
            {/* Confetti-like elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="absolute top-20 right-20 w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="absolute bottom-20 left-20 w-5 h-5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }} />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <h1 className="text-3xl font-bold font-heading mb-4">
              🎉 You're <span className="text-gradient">IN!</span>
            </h1>

            <p className="text-muted-foreground mb-6">
              Congratulations! You've successfully registered for the <strong>{workshopContentData.title}</strong>. 
              Get ready to learn, compete, and win <span className="text-primary font-bold">₹{workshopContentData.prizeAmount}!</span>
            </p>

            <div className="bg-primary/10 rounded-2xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Join our WhatsApp group for:</p>
              <ul className="text-left text-sm space-y-1">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Class links & schedules</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Study materials</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Quiz updates</li>
              </ul>
            </div>

            <a
              href={workshopContentData.whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg w-full justify-center"
            >
              <FaWhatsapp className="w-6 h-6" />
              Join WhatsApp Group Now
            </a>

            <div className="mt-8">
              <Link
                to="/"
                className="text-primary hover:underline text-sm font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Home Navigation - Top Left */}
      <Link 
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-lg border border-primary/50 rounded-full hover:from-primary/30 hover:to-purple-500/30 hover:border-primary transition-all duration-300 group"
      >
        <Brain className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-sm text-primary">Learn Gen AI</span>
      </Link>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Free Badge */}
            {workshopContentData.isFree && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 font-bold mb-6"
              >
                <Gift className="w-5 h-5" />
                100% FREE WORKSHOP + CERTIFICATION
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6"
              dangerouslySetInnerHTML={{ 
                __html: workshopContentData.title
                  .replace('Gen AI', '<span class="text-gradient">Gen AI</span>')
                  .replace('Vibe Coding', '<span class="text-gradient">Vibe Coding</span>')
                  .replace('&', '&<br />')
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              {workshopContentData.subtitle}{" "}
              <span className="text-primary font-bold">Win ₹{workshopContentData.prizeAmount}!</span>
            </motion.p>

            {/* Prize Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-10"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/50 via-amber-400/50 to-yellow-500/50 rounded-2xl blur-2xl opacity-70 animate-pulse" />
                
                {/* Glassmorphism Card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-10 py-8 shadow-2xl">
                  <div className="flex items-center gap-6 justify-center">
                    {/* Trophy Icon Box */}
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Trophy className="w-9 h-9 text-black" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wider mb-1">Quiz Competition Prize</p>
                      {/* Gold Shining Text */}
                      <p 
                        className="text-5xl md:text-6xl font-bold"
                        style={{
                          background: 'linear-gradient(90deg, #FFD700 0%, #FFF8DC 25%, #FFD700 50%, #FFF8DC 75%, #FFD700 100%)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          animation: 'goldShine 3s linear infinite',
                        }}
                      >
                        ₹{Number(workshopContentData.prizeAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CSS Animation for Gold Shine */}
              <style>{`
                @keyframes goldShine {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">7 Days</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Live Classes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium">Free Certificate</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-medium">No Experience Needed</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.a
              href="#register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-primary text-primary-foreground text-xl font-bold rounded-full shadow-glow hover:scale-105 transition-transform"
            >
              Register Now - It's FREE!
              <ArrowRight className="w-6 h-6" />
            </motion.a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">Scroll to learn more</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              7 Days to <span className="text-gradient">Transform</span> Your Skills
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each day is packed with practical, hands-on learning that prepares you for the quiz competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopDays.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-primary text-sm font-semibold mb-1">Day {item.day}</div>
                    <h3 className="font-bold font-heading text-lg">{item.topic}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Competition Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-semibold mb-6">
                <Trophy className="w-5 h-5" />
                QUIZ COMPETITION
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                Win Up To <span className="text-gradient">₹50,000</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Complete the 7-day workshop and participate in our exciting quiz competition. 
                All questions will be from the content taught during the workshop - attend every session to maximize your chances!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Free to Participate</p>
                    <p className="text-sm text-muted-foreground">No entry fee, no hidden costs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Questions from Workshop</p>
                    <p className="text-sm text-muted-foreground">Everything you need to know will be taught</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Fair Competition</p>
                    <p className="text-sm text-muted-foreground">Equal opportunity for all participants</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground mb-2">Total Prize Pool</p>
                <p className="text-6xl md:text-7xl font-bold text-gradient mb-4">₹{workshopContentData.prizeAmount}</p>
                <p className="text-muted-foreground mb-6">Distributed Among Top 5 Winners</p>
                
                {/* Prize Distribution */}
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/30">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🥇</span>
                      <span className="font-bold">1st Place</span>
                    </div>
                    <span className="font-bold text-primary">₹25,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-500/10 rounded-xl border border-slate-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🥈</span>
                      <span className="font-bold">2nd Place</span>
                    </div>
                    <span className="font-bold text-slate-300">₹10,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-600/10 rounded-xl border border-amber-600/30">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🥉</span>
                      <span className="font-bold">3rd Place</span>
                    </div>
                    <span className="font-bold text-amber-500">₹8,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">4️⃣</span>
                      <span className="font-medium">4th Place</span>
                    </div>
                    <span className="font-medium">₹4,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">5️⃣</span>
                      <span className="font-medium">5th Place</span>
                    </div>
                    <span className="font-medium">₹3,000</span>
                  </div>
                </div>

                <div className="flex justify-center gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">7</p>
                    <p className="text-sm text-muted-foreground">Days</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-sm text-muted-foreground">Winners</p>
                  </div>
                  <div className="w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-primary">∞</p>
                    <p className="text-sm text-muted-foreground">Knowledge</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="py-20 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Register Now - <span className="text-gradient">It's FREE!</span>
            </h2>
            <p className="text-muted-foreground">
              Secure your spot in the workshop and quiz competition
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="electric-border glow-pulse"
          >
            <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shimmer">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <User className="w-4 h-4 text-primary" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.studentName ? "border-red-500" : "border-border/50"
                    }`}
                  />
                  {errors.studentName && (
                    <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your WhatsApp number"
                      maxLength={10}
                      className={`w-full pl-14 pr-4 py-3 bg-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                        errors.whatsappNumber ? "border-red-500" : "border-border/50"
                      }`}
                    />
                  </div>
                  {errors.whatsappNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>
                  )}
                </div>

                {/* Highest Qualification */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Highest Qualification
                  </label>
                  <select
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer ${
                      errors.highestQualification ? "border-red-500" : "border-border/50"
                    }`}
                  >
                    <option value="">Select your qualification</option>
                    {qualifications.map((qual) => (
                      <option key={qual} value={qual}>
                        {qual}
                      </option>
                    ))}
                  </select>
                  {errors.highestQualification && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.highestQualification}
                    </p>
                  )}
                </div>

                {/* Working in IT Industry */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Are you working in the IT industry?
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                        formData.workingInIT === "yes"
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-background/50 border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="workingInIT"
                        value="yes"
                        checked={formData.workingInIT === "yes"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      Yes
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                        formData.workingInIT === "no"
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-background/50 border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="workingInIT"
                        value="no"
                        checked={formData.workingInIT === "no"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      No
                    </label>
                  </div>
                  {errors.workingInIT && (
                    <p className="text-red-500 text-sm mt-1">{errors.workingInIT}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      🚀 Join the Workshop FREE
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-muted-foreground">
                  By registering, you agree to receive updates via WhatsApp
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about the workshop and quiz
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Don't Miss This <span className="text-gradient">Opportunity!</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Free workshop. Free certification. A chance to win ₹50,000. 
            What are you waiting for?
          </p>
          <a
            href="#register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-primary text-primary-foreground text-xl font-bold rounded-full shadow-glow hover:scale-105 transition-transform"
          >
            Register Now - It's FREE!
            <ArrowRight className="w-6 h-6" />
          </a>
        </motion.div>
      </section>

      {/* Back to Home */}
      <div className="text-center py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/50 rounded-full text-foreground font-medium hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500 transition-all"
        >
          <Home className="w-4 h-4 text-purple-400" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CertificationRegistration;
