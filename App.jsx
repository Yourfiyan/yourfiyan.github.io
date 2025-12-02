import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { 
  Terminal, 
  ShoppingCart, 
  Cpu, 
  Gamepad2, 
  Music, 
  Github, 
  Instagram, 
  Mail, 
  ExternalLink,
  Zap,
  Award
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * FONTS & GLOBAL STYLES INJECTION
 * ------------------------------------------------------------------
 */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Space+Grotesk:wght@300;500;700&family=Syne:wght@400;700;800&display=swap');
    
    :root {
      --bg-dark: #030305;
      --neon-purple: #8B5CF6;
      --neon-blue: #3B82F6;
      --neon-cyan: #06b6d4;
    }
    
    body {
      background-color: #030305; /* Fallback */
      color: #e2e8f0;
      margin: 0;
      overflow-x: hidden;
      font-family: 'JetBrains Mono', monospace;
      selection-background: var(--neon-purple);
      selection-color: white;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Syne', sans-serif;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .glass-panel:hover {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(139, 92, 246, 0.3);
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #030305;
    }
    ::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #8B5CF6;
    }
  `}</style>
);

/**
 * ------------------------------------------------------------------
 * 2D CANVAS BACKGROUND (Native Performance Replacement)
 * ------------------------------------------------------------------
 */
const StarFieldCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    // Particle System
    const particles = [];
    const particleCount = 200; 
    const color = '#8B5CF6';

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random()
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha; 
        ctx.fill();
        
        // Move
        p.x += p.dx;
        p.y += p.dy;
        
        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // Subtle pulse
        p.alpha += (Math.random() - 0.5) * 0.05;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.8) p.alpha = 0.8;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 pointer-events-none bg-transparent"
    />
  );
};


/**
 * ------------------------------------------------------------------
 * UI COMPONENTS
 * ------------------------------------------------------------------
 */

const Tagline = () => {
  const text = "Building the future from Titabar.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-cyan-400 font-mono text-sm md:text-base tracking-widest">
      {displayedText}<span className="animate-pulse">_</span>
    </span>
  );
};

const Card = ({ children, className = "", colSpan = "col-span-1", rowSpan = "row-span-1" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden group ${colSpan} ${rowSpan} ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};

const SocialLink = ({ href, icon: Icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
  >
    <div className="p-2 rounded-full bg-white/5 group-hover:bg-purple-600/20 transition-all">
      <Icon size={18} />
    </div>
    <span className="text-sm font-mono hidden md:block">{label}</span>
  </a>
);

/**
 * ------------------------------------------------------------------
 * MAIN APP COMPONENT
 * ------------------------------------------------------------------
 */
export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    // FORCED BACKGROUND COLOR HERE TO PREVENT WHITE FLASH
    <div 
      className="min-h-screen w-full relative selection:bg-purple-500/30 text-slate-200"
      style={{ backgroundColor: '#030305' }}
    >
      <GlobalStyles />
      <StarFieldCanvas />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 origin-left z-50"
        style={{ scaleX }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-24">
        
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 p-4 font-mono text-xs text-gray-500 hidden md:block">
            LOCATION: TITABAR, ASSAM<br/>
            STATUS: ONLINE<br/>
            SYSTEM: 100%
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              CLASS 10 STUDENT DEVELOPER
            </div>
            
            {/* REMOVED mix-blend-overlay to ensure text is visible against dark bg */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">
              SYED<br/>SUFIYAN<br/>HAMZA
            </h1>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <Tagline />
              <div className="h-px w-20 bg-gray-700 hidden md:block"></div>
              <p className="max-w-md text-gray-400 text-sm md:text-base leading-relaxed">
                Bridging the gap between Full-Stack Dev, System Automation, and Creative AI.
                Building the "Next Big Thing" on an i3-1215U.
              </p>
            </div>

            <div className="flex gap-4 pt-8">
              <SocialLink href="https://github.com" icon={Github} label="GitHub" />
              <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
              <SocialLink href="mailto:contact@syed.dev" icon={Mail} label="Email" />
            </div>
          </motion.div>
        </section>

        {/* BENTO GRID PROJECTS */}
        <section id="work">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold font-syne text-white">SELECTED WORK</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-4 h-auto md:h-[800px]">
            
            {/* Project 1: Eternal Shops (Large) */}
            <Card colSpan="md:col-span-2" rowSpan="md:row-span-2" className="group">
              <div className="absolute top-6 right-6 p-2 bg-black/50 rounded-full border border-white/10">
                <ShoppingCart size={20} className="text-purple-400" />
              </div>
              <div className="mt-auto">
                <div className="flex gap-2 mb-3">
                   <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-1 rounded">REACT</span>
                   <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">NODE</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Eternal Shops</h3>
                <p className="text-gray-400 text-sm">A full-stack e-commerce platform built for scale. Features secure payments, user dashboards, and dynamic inventory management.</p>
              </div>
            </Card>

            {/* Project 2: Jarvis AI (Tall) */}
            <Card colSpan="md:col-span-1" rowSpan="md:row-span-2">
              <div className="absolute top-6 right-6 p-2 bg-black/50 rounded-full border border-white/10">
                <Cpu size={20} className="text-cyan-400" />
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2">Jarvis AI</h3>
                <p className="text-gray-400 text-xs mb-4">Python-based voice assistant for Windows automation.</p>
                <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                  <div className="h-full bg-cyan-400 w-2/3 animate-pulse"></div>
                </div>
                <p className="text-[10px] text-cyan-400 font-mono mt-2">LISTENING...</p>
              </div>
            </Card>

            {/* Personal/Vibe Card */}
            <Card colSpan="md:col-span-1" rowSpan="md:row-span-1" className="bg-gradient-to-br from-purple-900/20 to-black">
              <div className="flex items-center gap-3 mb-4">
                <Music size={18} className="text-green-400 animate-spin-slow" />
                <span className="text-xs text-green-400 font-mono">NOW PLAYING</span>
              </div>
              <div className="mt-auto">
                <p className="text-white font-bold text-sm truncate">Voicemail (Sped Up)</p>
                <p className="text-gray-500 text-xs truncate">E Lownck ft. YNG Tally</p>
                <div className="flex gap-1 mt-3 items-end h-4">
                  {[1,2,3,4,5].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                      className="w-1 bg-green-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Innovation Marathon */}
            <Card colSpan="md:col-span-1" rowSpan="md:row-span-1">
              <Award size={24} className="text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white">Innovation Marathon</h3>
              <p className="text-gray-400 text-xs mt-2">2024-25 Participant. Solving real-world problems with code.</p>
            </Card>

            {/* Tech / Gaming Vibe */}
            <Card colSpan="md:col-span-2" rowSpan="md:row-span-1" className="bg-grid-white/[0.02]">
              <div className="flex flex-col md:flex-row md:items-center justify-between h-full gap-4">
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Terminal size={20} className="text-pink-500" />
                     System Admin
                   </h3>
                   <p className="text-gray-400 text-xs max-w-xs">
                     PowerShell automation scripts & Kali Linux pentesting on secondary rig.
                     User: <span className="text-pink-500 font-mono">syeds</span>
                   </p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-300 font-mono mb-2">
                    <Gamepad2 size={14} /> CURRENT STATUS
                  </div>
                  <div className="text-white text-sm font-bold">Chilling in the Vase World</div>
                  <div className="text-gray-500 text-[10px]">Sky: Children of Light</div>
                </div>
              </div>
            </Card>

          </div>
        </section>

        {/* TECH STACK MARQUEE */}
        <section className="py-10 border-y border-white/5 bg-black/20 overflow-hidden">
          <div className="flex gap-4 items-center">
            <span className="text-xs font-mono text-gray-500 px-4 shrink-0">STACK_INIT</span>
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
               {["REACT", "TAILWIND", "PYTHON", "POWERSHELL", "LINUX", "NEXT.JS", "FRAMER MOTION", "THREE.JS", "BLENDER", "KALI", "FIGMA"].map((tech, i) => (
                 <span key={i} className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-600 to-gray-800 hover:from-white hover:to-gray-400 transition-all cursor-default">
                   {tech}
                 </span>
               ))}
               {/* Repeat for seamless loop */}
               {["REACT", "TAILWIND", "PYTHON", "POWERSHELL", "LINUX", "NEXT.JS", "FRAMER MOTION", "THREE.JS", "BLENDER", "KALI", "FIGMA"].map((tech, i) => (
                 <span key={`dup-${i}`} className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-600 to-gray-800 hover:from-white hover:to-gray-400 transition-all cursor-default">
                   {tech}
                 </span>
               ))}
            </div>
          </div>
        </section>

        {/* ABOUT / PERSONALITY */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold font-syne">THE PERSON<br/><span className="text-purple-500">BEHIND THE CODE</span></h2>
            <p className="text-gray-400 leading-relaxed font-mono text-sm">
              I'm not just writing code; I'm building systems on an HP 15s (i3-1215U), proving you don't need a supercomputer to innovate. Whether it's scripting folder access in PowerShell, exploring the Vase World in Sky, or analyzing e-commerce trends for Eternal Shops, I'm obsessed with optimizing every bit.
            </p>
            <p className="text-gray-400 leading-relaxed font-mono text-sm">
              Based in Titabar (785630). My mind is usually somewhere between a Kali Linux terminal and a low-spec gaming session.
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">Minecraft Builder</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">Indie Game Supporter</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">Tech Investment</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">Privacy Advocate</span>
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-[80px] opacity-20"></div>
             <div className="glass-panel p-8 rounded-2xl relative z-10 border-l-4 border-purple-500">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Zap size={18} className="text-yellow-400" />
                 LATEST THOUGHTS
               </h3>
               <div className="space-y-4">
                 <div className="p-3 bg-black/40 rounded border border-white/5">
                   <p className="text-gray-300 text-xs italic">"Currently researching AI integration for Windows. Imagine a Jarvis that actually controls the OS level. That's the goal."</p>
                 </div>
                 <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                   <span>Listening to: Voicemail (Sped Up)</span>
                   <span>Mood: Focused</span>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 pb-10 border-t border-white/5 flex flex-col items-center justify-center text-center space-y-8">
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
            LET'S BUILD<br/>SOMETHING <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">COOL</span>
          </h2>
          <a href="mailto:contact@example.com" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-purple-400 hover:scale-105 transition-all">
            Start a Project <ExternalLink size={18} />
          </a>
          <p className="text-gray-600 text-xs font-mono mt-12">
            © 2025 SYED SUFIYAN HAMZA. DEVELOPED IN TITABAR. <br/>
            Running on React + Tailwind.
          </p>
        </footer>

      </main>

      {/* CUSTOM CSS FOR MARQUEE ANIMATION since we can't use config file */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
