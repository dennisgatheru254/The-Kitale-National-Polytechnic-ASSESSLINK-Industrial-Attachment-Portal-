import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Import local images from the Images folder
import bgImage1 from '../../Images/images (1).jpeg';
import bgImage2 from '../../Images/images (2).jpeg';
import bgImage3 from '../../Images/images (3).jpeg';
import bgImage4 from '../../Images/images (4).jpeg';
import bgImage5 from '../../Images/images (5).jpeg';
import bgImage6 from '../../Images/images.jpeg';
import bgImage7 from '../../Images/1776760797230.jpeg';
import bgImage8 from '../../Images/mMzje.jpg';

interface BackgroundSlide {
  id: number;
  url: string;
  label: string;
  activity: string;
}

const SLIDES: BackgroundSlide[] = [
  {
    id: 1,
    url: bgImage1,
    label: "Collaborative Engineering Lab",
    activity: "Trainees designing electrical circuitry layouts"
  },
  {
    id: 2,
    url: bgImage2,
    label: "Information Systems Research",
    activity: "Analyzing regional server telemetry logs"
  },
  {
    id: 3,
    url: bgImage3,
    label: "Civil & Structural Design Center",
    activity: "Assessing load-bearing dry mix parameters"
  },
  {
    id: 4,
    url: bgImage4,
    label: "Food Process Automation Lab",
    activity: "Monitoring cold-chain logistics metrics"
  },
  {
    id: 5,
    url: bgImage5,
    label: "Automotive Diagnostics Studio",
    activity: "Analyzing hybrid engine telemetry reports"
  },
  {
    id: 6,
    url: bgImage6,
    label: "Hospitality Management Hub",
    activity: "Reviewing regional guest check-in trends"
  },
  {
    id: 7,
    url: bgImage7,
    label: "Renewable Energy Design Unit",
    activity: "Commissioning decentralized solar kits"
  },
  {
    id: 8,
    url: bgImage8,
    label: "Quantity Surveying Workshop",
    activity: "Evaluating material variance charts"
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
