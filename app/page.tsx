"use client";

import React from "react";
import { Play, Info, Search, MessageCircle, Menu, Bell } from "lucide-react";

// --- DUMMY DATA (Real Image Links for Professional Look) ---
const HERO_MOVIE = {
  title: "Avatar: The Way of Water",
  desc: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started...",
  img: "https://image.tmdb.org/t/p/original/8RpDcs6KTProjectwrlTIVUpDDb.jpg", // High Res Avatar
};

const LATEST_UPLOADS = [
  { name: "Fallout", img: "https://image.tmdb.org/t/p/w500/8cZPLomcCnDdpInOHXCcVfiNSES.jpg" },
  { name: "Dune: Part Two", img: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
  { name: "Godzilla x Kong", img: "https://image.tmdb.org/t/p/w500/tM26baW12s6N1iXXXFzB5E8I2k9.jpg" },
  { name: "Civil War", img: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg" },
  { name: "Oppenheimer", img: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
];

const POPULAR_IND = [
  { name: "Now You See Me 2", img: "https://image.tmdb.org/t/p/w500/h6g6Wd6x3fC7M7o.jpg" },
  { name: "The Batman", img: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
  { name: "Inception", img: "https://image.tmdb.org/t/p/w500/9gk7admal4zl248LOkx1t43wKXI.jpg" },
  { name: "Interstellar", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* --- 1. NAVBAR (Sticky & Gradient) --- */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          {/* Custom NetVlyx Icon */}
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)]">
            <span className="text-white font-black text-lg">N</span>
          </div>
          <span className="text-xl font-bold text-red-600 tracking-wide drop-shadow-md hidden sm:block">
            NetVlyx
          </span>
        </div>

        <div className="flex gap-4">
          <button className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/10 transition">
             <MessageCircle size={20} className="text-green-500" />
          </button>
          <button className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/10 transition">
             <Search size={20} className="text-white" />
          </button>
          <button className="bg-red-600 p-2 rounded-full shadow-lg shadow-red-600/20">
             <Menu size={20} className="text-white" />
          </button>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="relative w-full h-[85vh] md:h-[90vh]">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_MOVIE.img}
            alt="Hero Movie"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 w-full px-5 pb-8 flex flex-col items-center text-center space-y-4 z-20">
          
          {/* Tags */}
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded shadow-lg shadow-red-900/50">Trending</span>
            <span className="bg-[#fbbf24] text-black px-2 py-0.5 rounded">IMDb 7.8</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded">Sci-Fi</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg">
             Avatar
             <span className="block text-xl md:text-2xl font-light text-gray-200 mt-1">Fire and Ash</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base max-w-lg line-clamp-2 leading-relaxed">
            {HERO_MOVIE.desc}
          </p>

          {/* Buttons */}
          <div className="flex w-full max-w-md gap-3 pt-2">
            <button className="flex-1 bg-white text-black py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition hover:bg-gray-200">
              <Play size={20} className="fill-black" /> Watch
            </button>
            <button className="flex-1 bg-gray-500/30 backdrop-blur-md text-white py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 border border-gray-500/50 active:scale-95 transition hover:bg-gray-500/40">
              <Info size={20} /> More Info
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-2 pt-3">
            {[1,2,3,4].map((dot, i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 1 ? 'w-6 bg-red-600' : 'w-1.5 bg-gray-500'}`} />
            ))}
          </div>
        </div>
      </header>

      {/* --- 3. LATEST UPLOADS (Slider) --- */}
      <section className="mt-4 pl-5 space-y-3">
        <div className="flex justify-between items-end pr-5">
           <h2 className="text-lg md:text-xl font-bold text-white">Latest Uploads</h2>
           <button className="text-xs text-red-500 font-semibold hover:text-red-400">View All</button>
        </div>

        <div className="flex overflow-x-auto gap-3 pb-6 scrollbar-hide pr-5">
          {LATEST_UPLOADS.map((movie, i) => (
            <div key={i} className="min-w-[130px] md:min-w-[160px] relative group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                <img
                  src={movie.img}
                  alt={movie.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
              </div>
              <p className="mt-2 text-xs text-gray-400 font-medium truncate">{movie.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. TOP 10 SECTION (The Number Effect) --- */}
      <section className="mt-2 pl-5 mb-10">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">Top 10 in India Today</h2>
        
        <div className="flex overflow-x-auto gap-4 pb-8 scrollbar-hide items-center pr-5">
          {POPULAR_IND.map((movie, index) => (
            <div key={index} className="relative min-w-[150px] md:min-w-[180px] flex items-end h-[160px] md:h-[200px] cursor-pointer group">
              
              {/* The Big Number (SVG Trick) */}
              <span 
                className="absolute -left-5 -bottom-2 text-[110px] md:text-[140px] font-black leading-none text-black z-0 scale-y-110 transform transition-transform group-hover:translate-x-1"
                style={{ 
                  WebkitTextStroke: "4px #5e5e5e", // Grey Outline
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                }}
              >
                {index + 1}
              </span>

              {/* Movie Poster */}
              <img
                src={movie.img}
                alt={movie.name}
                className="relative z-10 w-[110px] md:w-[130px] h-full object-cover rounded-md ml-8 shadow-lg shadow-black/80 border border-white/10 transform group-hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- BOTTOM SPACER --- */}
      <div className="w-full h-20 bg-gradient-to-t from-black to-transparent flex items-center justify-center text-gray-600 text-xs">
         Designed with Next.js & Tailwind
      </div>

    </div>
  );
}
