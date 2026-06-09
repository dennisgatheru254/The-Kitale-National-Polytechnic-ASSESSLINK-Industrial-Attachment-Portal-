import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Award, Sparkles, X, Users, Compass } from 'lucide-react';

interface StudentSuccess {
  id: number;
  name: string;
  course: string;
  institution: string;
  company: string;
  image: string;
  story: string;
}

const STUDENTS: StudentSuccess[] = [
  {
    id: 1,
    name: "Mwangi Waithera",
    course: "Electrical & Electronic Engineering",
    institution: "Kisumu National Polytechnic",
    company: "KenGen Kenya Ltd",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&fit=crop&q=80",
    story: "Spearheading green energy initiatives during his placement in geothermal power dispatch cells."
  },
  {
    id: 2,
    name: "Amina Osei",
    course: "Information Technology & Cybersecurity",
    institution: "Kenya Coast National Polytechnic",
    company: "Safaricom Security Operations",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&fit=crop&q=80",
    story: "Collaborated on implementing state-of-the-art vulnerability scanning modules on regional TVET servers."
  },
  {
    id: 3,
    name: "Kofi Juma",
    course: "Civil & Structural Engineering",
    institution: "Eldoret National Polytechnic",
    company: "Bamburi Cement Ltd",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop&q=80",
    story: "Automated critical dry-mix raw feed calculations, saving processing coordinates check cycles."
  },
  {
    id: 4,
    name: "Zola Cherono",
    course: "Food Science & Processing",
    institution: "Kabete National Polytechnic",
    company: "Brookside Dairy Group",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80",
    story: "Optimized quality assurance protocols, guaranteeing cold-chain safety for dairy regional logistics."
  },
  {
    id: 5,
    name: "Jomo Kamau",
    course: "Automotive Technology & Design",
    institution: "Nyeri National Polytechnic",
    company: "Toyota East Africa",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
    story: "Designed diagnostic diagnostic logs for modern hybrid power-train assemblies."
  },
  {
    id: 6,
    name: "Fatoumata Nekesa",
    course: "Hospitality & Institutional Management",
    institution: "Sigalagala National Polytechnic",
    company: "Sarova Hotels & Resorts",
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&fit=crop&q=80",
    story: "Acquired first-class praise for implementing contactless guest check-ins using centralized QR logs."
  },
  {
    id: 7,
    name: "Obi Mandela",
    course: "Mechanical Engineering (Plant Option)",
    institution: "Meru National Polytechnic",
    company: "Davis & Shirtliff Ltd",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop&q=80",
    story: "Led an off-grid solar-pump installation in high-density arid agricultural sectors."
  },
  {
    id: 8,
    name: "Taye Otieno",
    course: "Building Economics & Quantity Surveying",
    institution: "Kitale National Polytechnic",
    company: "Landmark Holdings Ltd",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
    story: "Analyzed material variance indices using cloud spreadsheets, shortening logistics delays."
  },
  {
    id: 9,
    name: "Lulu Adhiambo",
    course: "Applied Biology & Bio-chemistry",
    institution: "Kisii National Polytechnic",
    company: "KEMRI (Kenya Medical Research)",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&fit=crop&q=80",
    story: "Conducted analysis on vaccine strain safety, earning institutional supervisor commendation."
  },
  {
    id: 10,
    name: "Chidi Waweru",
    course: "Renewable Energy Engineering",
    institution: "Kisii National Polytechnic",
    company: "d.light Solar Africa Ltd",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&fit=crop&q=80",
    story: "Commissioned pay-as-you-go micro-grid solar kits for sustainable rural community learning."
  }
];

export const StudentShowcasePresentation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STUDENTS.length);
    }, 6000); // Transitions slowly every 6 seconds
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % STUDENTS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + STUDENTS.length) % STUDENTS.length);
  };

  const activeStudent = STUDENTS[currentIndex];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 bg-[#7B1C2E] hover:bg-[#611624] text-white rounded-full text-[11px] font-bold shadow-[0_0_12px_rgba(123,28,46,0.5)] border border-[#7B1C2E]/50 transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>View Placed Trainees (10)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-76 sm:w-80 bg-slate-900 border border-[#7B1C2E] text-white rounded-2xl p-4 shadow-[0_0_20px_rgba(123,28,46,0.65)] backdrop-blur-md transition-all duration-500 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#7B1C2E]/25 to-transparent blur-md pointer-events-none opacity-50"></div>

      <div className="relative z-10 space-y-3">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#DE516E]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F5E8EB]">KNPSS Alumni Grid</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white transition text-[9px] font-mono"
              title={isPlaying ? "Pause Presentation Slider" : "Auto-Play Slider"}
            >
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
            <button 
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white transition"
              title="Minimize Showcase"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slow Smooth Presentation Slideshow Animation */}
        <div className="relative min-h-[220px] bg-slate-950/80 rounded-xl overflow-hidden p-3 border border-white/5 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex flex-col items-center text-center space-y-2.5 h-full"
            >
              {/* Image with Glowing maroon shadow transitioning slowly */}
              <div className="relative group mt-0.5">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#7B1C2E] to-[#DE516E] rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                <img
                  src={activeStudent.image}
                  alt={activeStudent.name}
                  referrerPolicy="no-referrer"
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-[#7B1C2E] transition-all duration-700 shadow-[0_0_15px_#7B1C2E]"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#7B1C2E] border border-white/20 text-[8px] font-bold text-white px-1 py-0.2 rounded-full flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-green-400 animate-ping"></span>
                  Placed
                </span>
              </div>

              {/* Trainee description info */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-[12px] text-white tracking-tight leading-tight">{activeStudent.name}</h4>
                <p className="text-[9.5px] font-semibold text-[#DE516E] leading-none uppercase">{activeStudent.course}</p>
                <div className="flex flex-col items-center text-[9px] text-gray-300 font-medium pt-1">
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-full block text-center max-w-full truncate">
                    📍 {activeStudent.institution}
                  </span>
                  <span className="text-[#DE516E] font-bold mt-1 bg-[#7B1C2E]/20 border border-[#7B1C2E]/30 px-2 py-0.5 rounded-full">
                    🏢 {activeStudent.company}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 italic font-medium leading-normal px-1 pt-1 border-t border-white/5 mt-1">
                  "{activeStudent.story}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls & Slide indices */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
          <div className="flex gap-0.5">
            {STUDENTS.map((s, idx) => (
              <span
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                  currentIndex === idx ? 'bg-[#DE516E] w-3' : 'bg-white/20 hover:bg-white/45'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="p-1 rounded bg-slate-850 hover:bg-slate-800 hover:text-white transition border border-white/5 active:scale-90"
              title="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-gray-300 border border-white/5">
              {currentIndex + 1}/10
            </span>
            <button
              onClick={nextSlide}
              className="p-1 rounded bg-slate-850 hover:bg-slate-800 hover:text-white transition border border-white/5 active:scale-90"
              title="Next Slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
