import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BackgroundSlide {
  id: number;
  url: string;
  label: string;
  activity: string;
}

const SLIDES: BackgroundSlide[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&fit=crop&q=80",
    label: "Collaborative Engineering Lab",
    activity: "Trainees designing electrical circuitry layouts"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1400&fit=crop&q=80",
    label: "Information Systems Research",
    activity: "Analyzing regional server telemetry logs"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1400&fit=crop&q=80",
    label: "Civil & Structural Design Center",
    activity: "Assessing load-bearing dry mix parameters"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&fit=crop&q=80",
    label: "Food Process Automation Lab",
    activity: "Monitoring cold-chain logistics metrics"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1400&fit=crop&q=80",
    label: "Automotive Diagnostics Studio",
    activity: "Analyzing hybrid engine telemetry reports"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=1400&fit=crop&q=80",
    label: "Hospitality Management Hub",
    activity: "Reviewing regional guest check-in trends"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1400&fit=crop&q=80",
    label: "Renewable Energy Design Unit",
    activity: "Commissioning decentralized solar kits"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&fit=crop&q=80",
    label: "Quantity Surveying Workshop",
    activity: "Evaluating material variance charts"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1400&fit=crop&q=80",
    label: "Applied Genomics Facility",
    activity: "Validating safe viral culture benchmarks"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=1400&fit=crop&q=80",
    label: "Advanced Technical Training Center",
    activity: "Simulating national grid dispatch codes"
  }
];

export const LoginBackgroundSlideshow: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000); // Cross-fade smoothly every 7 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none z-0 pointer-events-none">
      {/* Immersive Crossfading Slides */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full bg-slate-950"
        >
          {/* Main Background Image */}
          <img
            src={SLIDES[index].url}
            alt="Trainee BG"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.3] contrast-[1.05]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Maroon & Dark Gradient Overlays for High Contrast Design Block */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(123, 28, 46, 0.25) 0%, rgba(15, 23, 42, 0.85) 75%, rgba(2, 6, 23, 0.95) 100%)'
        }}
      />

      {/* Intricately layered Maroon Glows for presentation feel */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#7B1C2E] opacity-25 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#7B1C2E] opacity-20 blur-[130px] mix-blend-screen pointer-events-none"></div>



      {/* Tiny indicators so users feel the slow presentation pacing */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-1">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-700 ${
              i === index ? 'w-4 bg-[#DE516E]' : 'w-1 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
