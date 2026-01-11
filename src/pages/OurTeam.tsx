import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Mail, Linkedin, Instagram, Twitter } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const teamMembers = [
  {
    name: "Pratik Verma",
    role: "SDE 3",
    image: "/Experts/Pratik SDE 3.jpeg",
    skills: ["System Design", "Cloud Architecture", "Backend Scaling", "Mentorship"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Khilendra",
    role: "AI Engineer",
    image: "/Experts/Khilendra AI Engineer .jpeg",
    skills: ["Generative AI", "LLMs", "Python", "Computer Vision"],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Dageshwar",
    role: "SDE 2 Full Stack Developer",
    image: "/Experts/Dageshwar SDE 2 Full Stack Developer.jpeg",
    skills: ["React.js", "Node.js", "PostgreSQL", "Next.js"],
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Ehtesham Danish",
    role: "Full Stack Developer",
    image: "/Experts/Ehthesham danish.png",
    skills: ["MERN Stack", "UI/UX Design", "API Development", "Redux"],
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Nitish Mishra",
    role: "Full Stack Developer",
    image: "/Experts/Nitish Full Stack Developer.jpeg",
    skills: ["Full Stack Dev", "TypeScript", "Problem Solving", "Architecture"],
    color: "from-indigo-500 to-blue-500",
  },
];

const OurTeam = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 glass-effect">
        <Link to="/" className="text-2xl font-bold font-heading">
          <span className="text-gradient">Toran Sir</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </nav>

      <section className="py-32 px-4 relative min-h-screen">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-primary font-accent text-xl italic mb-2">
              The Minds Behind the Tech
            </p>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              Our <span className="text-gradient">Expert</span> Team
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-light">
              Meet our world-class team of engineers and innovators dedicated to building cutting-edge solutions and mentoring the next generation of tech leaders.
            </p>
            <div className="artistic-line mx-auto mt-8" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                <div className="relative bg-card/40 backdrop-blur-md border border-border/50 p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col items-center">
                  {/* Circle Image */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors relative z-10">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold font-heading mb-1 text-center group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold text-sm mb-6 uppercase tracking-wider text-center">
                    {member.role}
                  </p>
                  
                  <div className="w-full space-y-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-4 py-1.5 bg-secondary/50 text-xs font-medium rounded-full border border-border/50 group-hover:border-primary/30 transition-colors text-muted-foreground group-hover:text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links placeholder */}
                  <div className="flex gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Linkedin className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                    <Instagram className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                    <Mail className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="text-2xl font-bold font-heading mb-4 inline-block">
            <span className="text-gradient">Toran Sir</span>
          </Link>
          <p className="text-muted-foreground mb-8">Empowering Excellence through Expert Mentorship.</p>
          <p className="text-sm text-muted-foreground/60">&copy; 2025 Toran Sir Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OurTeam;
