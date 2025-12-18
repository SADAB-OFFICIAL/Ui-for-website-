"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Play, Share2, Star, ChevronLeft, AlertCircle, MonitorPlay, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieDetail() {
  // UI State: 'select' | 'download' | 'watch'
  const [mode, setMode] = useState<"select" | "download" | "watch">("select");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20 selection:bg-purple-500 selection:text-white">
      
      {/* --- BACK BUTTON (To Home) --- */}
      <div className="fixed top-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/">
          <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition hover:bg-white/10">
            <ArrowLeft size={18} /> Back
          </button>
        </Link>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative w-full pt-24 px-5 flex flex-col items-center md:items-start md:flex-row gap-8">
        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

        {/* Poster */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="w-[200px] md:w-[300px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(120,50,255,0.3)] border border-white/10"
        >
           <img 
             src="https://image.tmdb.org/t/p/w500/2w1458e0a7f1a1a1a.jpg" // Akhanda 2 Poster
             alt="Movie Poster" 
             className="w-full h-auto object-cover"
           />
        </motion.div>

        {/* Info */}
        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
           <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
             Akhanda 2 <span className="text-purple-400">(2025)</span>
           </h1>
           <p className="text-gray-400 text-sm md:text-base font-medium">
             Action • Drama • 2h 45m
           </p>
           
           <div className="flex items-center justify-center md:justify-start gap-3">
             <span className="bg-[#fbbf24] text-black px-3 py-1 rounded font-bold text-xs flex items-center gap-1">
               <Star size={12} fill="black" /> 8.4 IMDb
             </span>
             <span className="border border-white/20 px-3 py-1 rounded text-xs text-gray-300">HQ-HDTC</span>
           </div>

           <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 px-2 md:px-0">
             When all hope died, Akhanda arrived. He saved his family, protected his people, killed the wrongdoers, and retreated into isolation.
           </p>
        </div>
      </div>

      {/* --- DYNAMIC SECTION: DOWNLOAD & WATCH --- */}
      <div className="mt-10 px-5 max-w-lg mx-auto md:mx-0">
        
        {/* Header with Back Logic */}
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-bold">Download & Watch Options</h2>
                <p className="text-xs text-gray-500">Choose how you want to enjoy this content</p>
            </div>
            
            {/* Show internal back button only if not in 'select' mode */}
            {mode !== "select" && (
                <button 
                  onClick={() => setMode("select")}
                  className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition"
                >
                    <ChevronLeft size={14} /> Back
                </button>
            )}
        </div>

        {/* --- VIEW 1: SELECTION MODE (Default) --- */}
        {mode === "select" && (
            <div className="space-y-4">
                {/* Download Button */}
                <motion.button 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setMode("download")}
                    className="w-full bg-[#111] border border-gray-800 p-5 rounded-2xl flex items-center gap-4 active:scale-95 transition hover:border-purple-500/50 group"
                >
                    <div className="p-3 bg-purple-900/20 rounded-full group-hover:bg-purple-600 transition duration-300">
                        <Download size={24} className="text-purple-500 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg">Download</h3>
                        <p className="text-gray-500 text-xs">Save to your device</p>
                    </div>
                </motion.button>

                {/* Watch Online Button */}
                <motion.button 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    onClick={() => setMode("watch")}
                    className="w-full bg-[#051005] border border-green-900/30 p-5 rounded-2xl flex items-center gap-4 active:scale-95 transition hover:border-green-500/50 group"
                >
                    <div className="p-3 bg-green-900/20 rounded-full group-hover:bg-green-600 transition duration-300">
                        <Play size={24} className="text-green-500 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg">Watch Online</h3>
                        <p className="text-gray-500 text-xs">Stream Instantly</p>
                    </div>
                </motion.button>
            </div>
        )}

        {/* --- VIEW 2: DOWNLOAD LIST (Pic 1 Style) --- */}
        {mode === "download" && (
            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
            >
                <p className="text-center text-sm font-semibold mb-2">Select Quality</p>
                {DOWNLOAD_LINKS.map((link, i) => (
                    <button key={i} className="w-full relative overflow-hidden group rounded-lg p-[1px] active:scale-95 transition">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80 group-hover:opacity-100 transition" />
                        <div className="relative bg-black/20 backdrop-blur-sm hover:bg-transparent transition h-full flex items-center justify-between px-4 py-3 rounded-lg text-white">
                            <div className="flex items-center gap-3">
                                <Download size={18} />
                                <span className="font-bold">{link.quality}</span>
                            </div>
                            <span className="text-xs bg-black/40 px-2 py-1 rounded text-gray-200">{link.size}</span>
                        </div>
                    </button>
                ))}
            </motion.div>
        )}

        {/* --- VIEW 3: PLAYER SELECTION (Pic 2 Style) --- */}
        {mode === "watch" && (
            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
            >
                <p className="text-center text-sm font-semibold mb-2">Choose Your Player</p>
                
                {/* Internal Player (Orange Theme) */}
                <div className="w-full bg-[#1a0f05] border border-orange-900/50 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-orange-500 transition">
                    <div className="p-3 border-2 border-orange-500 rounded-full text-orange-500">
                        <Play size={32} fill="currentColor" />
                    </div>
                    <h3 className="font-bold text-xl">Play Here</h3>
                    <div className="bg-orange-900/30 text-orange-400 text-[10px] px-3 py-1 rounded-full flex items-center gap-1 border border-orange-800">
                        <AlertCircle size={10} /> May contain ads
                    </div>
                </div>

                {/* External Player (Blue Theme) */}
                <div className="w-full bg-[#0a0f1a] border border-blue-900/50 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-500 transition">
                    <div className="flex gap-2">
                         {/* Fake Icons for VLC/MX */}
                         <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-lg">VLC</div>
                         <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-lg">MX</div>
                    </div>
                    <h3 className="font-bold text-xl">Play on External Player</h3>
                    <p className="text-xs text-gray-400">Better experience, ad-free</p>
                </div>
            </motion.div>
        )}

      </div>

      {/* --- CAST & CREW (Screenshot Style) --- */}
      <div className="mt-12 px-5">
         <h2 className="text-lg font-bold mb-4">Cast & Crew</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {CAST_DATA.map((actor, i) => (
                 <div key={i} className="flex flex-col items-center text-center">
