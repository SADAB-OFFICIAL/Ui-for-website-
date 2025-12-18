"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Navigation ke liye Link import kiya
import { Play, Info, Search, MessageCircle, Menu, Volume2, VolumeX, Bell } from "lucide-react"; 
import { motion } from "framer-motion";

// --- DATA ---
const HERO_MOVIE = {
  title: "Dune: Part Two",
  desc: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  poster: "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
};

const LATEST_UPLOADS = [
  { name: "Fallout", img: "https://image.tmdb.org/t/p/w500/8cZPLomcCnDdpInOHXCcVfiNSES.jpg" },
  { name: "Godzilla x Kong", img: "https://image.tmdb.org/t/p/w500/tM26baW12s6N1iXXXFzB5E8I2k9.jpg" },
  { name: "Civil War", img: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg" },
  { name: "Oppenheimer", img: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
  { name: "Deadpool 3", img: "https://image.tmdb.org/t/p/w500/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg" },
];

const POPULAR_IND = [
  { name: "Kalki 2898 AD", img: "https://image.tmdb.org/t/p/w500/bieeC0483MhH0r3j9i9yY3t0dYh.jpg" },
  { name: "Pushpa 2", img: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHkjJDve25.jpg" },
  { name: "Salaar", img: "https://image.tmdb.org/t/p/w500/m1b9ZB7A5wL4k09U8J9Q6j1.jpg" },
  { name: "Animal", img: "https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBK9JThhKdxrMvU.jpg" },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Navbar Scroll Effect Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* --- 1. ADVANCED NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 py-4 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]"
          >
            <span className="text-white font-black text-lg">N</span>
          </motion.div>
          <span className="text-xl font-bold text-red-600 tracking-wide hidden sm:block">NetVlyx</span>
        </div>

        <div className="flex gap-4">
          <button className="hover:text-gray-300 transition transform hover:scale-110">
             <Search size={22} className="text-white" />
          </button>
          <button className="hover:text-gray-300 transition transform hover:scale-110">
             <Bell size={22} className="text-white" />
          </button>
          <button className="hover:text-gray-300 transition transform hover:scale-110">
             <Menu size={22} className="text-white" />
          </button>
        </div>
      </nav>

      {/* --- 2. CINEMATIC VIDEO HERO SECTION --- */}
      <header className="relative w-full h-[90vh] overflow-hidden">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
            <video 
              className="w-full h-full object-cover scale-125 md:scale-100 opacity-60"
              autoPlay 
              loop 
              muted={isMuted} 
              playsInline
              poster={HERO_MOVIE.poster}
            >
              <source src={HERO_MOVIE.videoUrl} type="video/mp4" />
            </video>
            
            {/* Professional Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#141414]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Hero Content with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-[20%] left-4 md:left-12 max-w-xl space-y-5 z-10"
        >
          {/* Logo / Title */}
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
            {HERO_MOVIE.title.toUpperCase()}
          </h1>

          <div className="flex items-center gap-3 text-sm font-semibold text-green-400">
            <span>98% Match</span>
            <span className="text-gray-300">2024</span>
            <span className="border border-gray-500 px-1 text-gray-300 text-xs rounded">U/A 13+</span>
          </div>

          <p className="text-gray-200 text-sm md:text-lg line-clamp-3 text-shadow-md">
            {HERO_MOVIE.desc}
          </p>

          <div className="flex gap-4 pt-2">
            <Link href="/movie">
                <button className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded hover:bg-opacity-80 transition font-bold flex items-center gap-2 text-lg">
                <Play fill="black" size={24} /> Play
                </button>
            </Link>
            <button className="bg-gray-500/40 backdrop-blur-sm text-white px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/60 transition font-bold flex items-center gap-2 text-lg">
              <Info size={24} /> More Info
            </button>
            {/* Mute/Unmute Toggle */}
            <button onClick={() => setIsMuted(!isMuted)} className="p-3 border border-gray-400 rounded-full hover:bg-white/10 transition">
               {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
            </button>
          </div>
        </motion.div>
      </header>

      {/* --- 3. SLIDERS WITH HOVER EFFECTS --- */}
      <div className="relative z-20 -mt-24 space-y-10 pb-20 px-4 md:px-12">
        
        {/* Latest Movies */}
        <Section title="Latest Releases">
          {LATEST_UPLOADS.map((movie, i) => (
            // Link added here
            <Link href="/movie" key={i}>
                <motion.div 
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="min-w-[140px] md:min-w-[220px] bg-[#1f1f1f] rounded-md overflow-hidden cursor-pointer relative group shadow-lg"
                >
                <img src={movie.img} alt={movie.name} className="w-full h-[200px] md:h-[120px] object-cover" />
                
                {/* Hover Info (Desktop mainly) */}
                <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-200 group-hover:text-white">{movie.name}</h3>
                    <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400">
                        <span className="text-green-400">New</span>
                        <div className="flex gap-2">
                        <div className="border border-gray-600 rounded-full p-1"><Play size={8} fill="white"/></div>
                        </div>
                    </div>
                </div>
                </motion.div>
            </Link>
          ))}
        </Section>

        {/* Top 10 (Big Numbers) */}
        <Section title="Top 10 Movies in India">
          {POPULAR_IND.map((movie, index) => (
            // Link added here
            <Link href="/movie" key={index}>
                <motion.div whileHover={{ scale: 1.1 }} className="relative min-w-[160px] md:min-w-[200px] flex items-end h-[180px] cursor-pointer">
                <span className="absolute -left-6 bottom-0 text-[100px] font-black leading-none text-[#141414] drop-shadow-lg" style={{ WebkitTextStroke: "4px #555" }}>
                    {index + 1}
                </span>
                <img src={movie.img} alt={movie.name} className="relative z-10 w-[120px] h-[160px] object-cover rounded-md ml-6 shadow-black/80 shadow-xl" />
                </motion.div>
            </Link>
          ))}
        </Section>

      </div>
    </div>
  );
}

// --- REUSABLE SECTION COMPONENT ---
function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white hover:text-red-500 transition cursor-pointer inline-flex items-center gap-2">
        {title} <span className="text-sm text-cyan-500 opacity-0 hover:opacity-100 transition">Explore &gt;</span>
      </h2>
      <div className="flex overflow-x-auto gap-4 pb-8 scrollbar-hide items-center">
        {children}
      </div>
    </div>
  );
}
