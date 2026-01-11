import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Quote, User } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const certifiedStudents = [
  {
    name: "Bhupendra Sahu",
    course: "Full Stack Course",
    image: "/students/Bhupendra sahu student.jpeg",
    color: "from-blue-500 to-indigo-600",
    description: "Demonstrated exceptional mastery in modern MERN stack development.",
    review: "The best academy for practical MERN stack training. The human-centric mentorship and project-based approach are top-notch!",
  },
  {
    name: "Dushyant",
    course: "AI / Vibe Coding + DSA",
    image: "/students/Dushyant student .jpeg",
    color: "from-purple-500 to-pink-600",
    description: "Mastered the intersection of Generative AI and algorithms.",
    review: "Amazing curriculum that bridges AI and core engineering. This course definitely prepared me for the future of coding.",
  },
  {
    name: "Khilendra",
    course: "DSA",
    image: "/students/khilendra student .jpeg",
    color: "from-orange-500 to-yellow-600",
    description: "Achieved elite status in complex algorithmic challenges.",
    review: "Deep dive into DSA helped me clear complex interview rounds. The teaching style makes difficult concepts easy to grasp.",
  },
  {
    name: "Sharon",
    course: "Frontend Mastery",
    image: "/students/sharon student .jpeg",
    color: "from-cyan-500 to-blue-600",
    description: "Creating immersive 3D web experiences using Three.js.",
    review: "Frontend Mastery is a game-changer! Learning Three.js and advanced GLSL was a smooth and exciting experience here.",
  },
  {
    name: "Srijan Verma",
    course: "AI Automation",
    image: "/students/srijan student .jpeg",
    color: "from-green-500 to-emerald-600",
    description: "Implementing cutting-edge AI agents and workflows.",
    review: "AI automation concepts were explained beautifully. The practical projects we built made all the difference in my career.",
  },
];

const certificates = [
  "/certificates/Blue White Modern Geometric Certificate of Completion (1).png",
  "/certificates/Blue White Modern Geometric Certificate of Completion (2).png",
  "/certificates/Blue White Modern Geometric Certificate of Completion (3).png",
  "/certificates/Blue White Modern Geometric Certificate of Completion (4).png",
  "/certificates/Blue White Modern Geometric Certificate of Completion.png",
];

const ToranSirSchool = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 glass-effect">
        <Link to="/" className="text-2xl font-bold font-heading">
          <span className="text-gradient">Toran Sir School</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </nav>

      <section className="py-32 px-4 relative min-h-screen">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-primary font-accent text-xl italic mb-2">
              Our Success Stories
            </p>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              Top <span className="text-gradient">Certified</span> Students
            </h1>
            <div className="artistic-line mx-auto mt-8" />
          </motion.div>

          {/* Flipping Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
            {certifiedStudents.map((student, index) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group h-[420px] [perspective:1000px]"
              >
                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Side */}
                  <div className="absolute inset-0 h-full w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 [backface-visibility:hidden]">
                    <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">Certified Expert</span>
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold font-heading mb-0.5">{student.name}</h3>
                      <p className="text-md font-medium text-primary">{student.course}</p>
                    </div>
                  </div>
                  {/* Back Side */}
                  <div className="absolute inset-0 h-full w-full rounded-[2rem] bg-card p-8 shadow-2xl border border-primary/20 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="h-full flex flex-col justify-between relative overflow-hidden">
                      <div>
                        <Quote className="w-10 h-10 text-primary/20 mb-4" />
                        <h4 className="text-lg font-bold font-heading mb-3 text-foreground">Academy Review</h4>
                        <p className="text-muted-foreground text-md leading-relaxed italic line-clamp-6">"{student.review}"</p>
                      </div>
                      <div className="pt-6 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{student.name}</p>
                            <p className="text-xs text-primary/80">{student.course} Student</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Certifications */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Recent <span className="text-primary italic">Certifications</span>
            </h2>
            <div className="artistic-line mx-auto opacity-50" />
          </div>

          <div className="relative mask-gradient-x overflow-hidden pb-20">
            <div className="flex animate-marquee gap-8 py-10 w-fit">
              {[...certificates, ...certificates].map((cert, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, zIndex: 10, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative flex-shrink-0 w-72 md:w-[450px] aspect-[1.414/1] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group bg-card"
                >
                  <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] pointer-events-none group-hover:shadow-[inset_0_0_150px_rgba(0,0,0,0.2)] transition-shadow duration-500" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="text-2xl font-bold font-heading mb-4 inline-block">
            <span className="text-gradient">Toran Sir School</span>
          </Link>
          <p className="text-muted-foreground mb-8">Empowering Excellence through Expert Mentorship.</p>
          <p className="text-sm text-muted-foreground/60">&copy; 2025 Toran Sir Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ToranSirSchool;
