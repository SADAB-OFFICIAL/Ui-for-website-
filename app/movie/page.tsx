"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Play, Share2, Star, HardDrive, Film } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieDetail() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-10">
      
      {/* --- BACK BUTTON --- */}
      <div className="fixed top-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/">
          <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
            <ArrowLeft size={18} /> Back
          </button>
        </Link>
      </div>

      {/* --- HERO SECTION (Info + Poster) --- */}
      <div className="relative w-full pt-20 px-5 flex flex-col items-center md:items-start md:flex-row gap-6">
        
        {/* Background Blur Effect */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

        {/* Poster Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[280px] md:max-w-[300px] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(100,0,200,0.3)] border border-white/10"
        >
           <img 
             src="https://image.tmdb.org/t/p/w500/2w1458e0a7f1a1a1a.jpg" // Akhanda 2 Placeholder
             alt="Movie Poster" 
             className="w-full h-auto object-cover"
           />
        </motion.div>

        {/* Movie Details */}
        <div className="w-full md:w-1/2 space-y-4">
           {/* IMDB Tag */}
           <div className="flex items-center gap-3">
             <span className="bg-[#fbbf24] text-black px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
               <Star size={12} fill="black" /> 5.7/10 IMDb
             </span>
             <span className="text-gray-400 text-xs">2025 • Action • 2h 45m</span>
           </div>

           {/* Title */}
           <h1 className="text-3xl font-extrabold leading-tight text-white">
             Akhanda 2 (2025) <br/>
             <span className="text-gray-300 text-xl font-medium">HQ-HDTC Dual Audio</span>
           </h1>
           
           <p className="text-green-400 font-medium text-sm">
             [Hindi (LiNE) + Telugu] Full Movie 480p [600MB] | 720p [1.5GB]
           </p>

           {/* Plot */}
           <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
             When all hope died, Akhanda arrived. He saved his family, protected his people, killed the wrongdoers, and retreated into isolation. But years later, new threats emerge...
           </p>

           {/* Action Buttons Row */}
           <div className="flex gap-3 pt-2">
             <button className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-700 transition">
               <Download size={18} /> Download
             </button>
             <button className="flex-1 bg-green-900/30 text-green-400 border border-green-600/50 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-900/50 transition">
               <Play size={18} /> Watch
             </button>
             <button className="p-2.5 bg-gray-800 rounded-lg border border-gray-700 text-gray-300">
               <Share2 size={18} />
             </button>
           </div>
        </div>
      </div>

      {/* --- GALLERY SECTION --- */}
      <div className="mt-10 px-5">
        <h2 className="text-xl font-bold mb-1">Gallery</h2>
        <p className="text-xs text-gray-500 mb-4">High quality scenes from the movie</p>
        
        <div className="grid grid-cols-2 gap-3">
           {GALLERY_IMAGES.map((img, i) => (
             <motion.img 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               src={img} 
               alt="Scene" 
               className="w-full h-28 object-cover rounded-lg border border-white/5"
             />
           ))}
        </div>
      </div>

      {/* --- DOWNLOAD & WATCH OPTIONS (Big Cards) --- */}
      <div className="mt-10 px-5 space-y-4">
        <div className="text-center mb-6">
           <h2 className="text-lg font-bold">Download & Watch Options</h2>
           <p className="text-xs text-gray-500">Choose how you want to enjoy this content</p>
        </div>

        {/* Download Card */}
        <button className="w-full bg-[#111] border border-gray-800 p-6 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition hover:border-purple-500/50 group">
           <div className="p-4 bg-purple-900/20 rounded-full group-hover:bg-purple-600 transition duration-300">
             <Download size={32} className="text-purple-500 group-hover:text-white" />
           </div>
           <div className="text-center">
             <h3 className="font-bold text-lg">Download</h3>
             <p className="text-gray-500 text-xs">Save to your device</p>
           </div>
        </button>

        {/* Watch Online Card */}
        <button className="w-full bg-[#051a05] border border-green-900/30 p-6 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition hover:border-green-500/50 group">
           <div className="p-4 bg-green-900/20 rounded-full group-hover:bg-green-600 transition duration-300">
             <Play size={32} className="text-green-500 group-hover:text-white" />
           </div>
           <div className="text-center">
             <h3 className="font-bold text-lg">Watch Online</h3>
             <p className="text-gray-500 text-xs">Stream Instantly</p>
           </div>
        </button>
      </div>

      {/* --- CAST & CREW --- */}
      <div className="mt-12 px-5 mb-10 text-center">
         <h2 className="text-lg font-bold mb-4">Cast & Crew</h2>
         <p className="text-xs text-gray-500">Meet the talented people...</p>
      </div>

    </div>
  );
}

// Dummy Gallery Data (Use real movie scene links)
const GALLERY_IMAGES = [
  "https://image.tmdb.org/t/p/w500/8cZPLomcCnDdpInOHXCcVfiNSES.jpg",
  "https://image.tmdb.org/t/p/w500/tM26baW12s6N1iXXXFzB5E8I2k9.jpg",
  "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
  "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  "https://image.tmdb.org/t/p/w500/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
  "https://image.tmdb.org/t/p/w500/bieeC0483MhH0r3j9i9yY3t0dYh.jpg"
];
