"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Play, Star, ChevronLeft, Eye, Zap, ChevronDown, Server, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieDetail() {
  // Modes: 'select' (Main) -> 'download' (List) -> 'vlyxdrive' (Final UI) | 'watch' (Player)
  const [mode, setMode] = useState("select");
  const [selectedQuality, setSelectedQuality] = useState("");

  const handleQualityClick = (quality: string) => {
    setSelectedQuality(quality);
    setMode("vlyxdrive");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20 selection:bg-purple-500 selection:text-white">
      
      {/* --- BACK BUTTON LOGIC --- */}
      <div className="fixed top-0 w-full z-50 p-4 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-2">
            {/* Main Back (To Home) */}
            {mode === "select" && (
                <Link href="/">
                <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition hover:bg-white/10">
                    <ArrowLeft size={18} /> Back
                </button>
                </Link>
            )}

            {/* Internal Back (To Selection) */}
            {(mode === "download" || mode === "watch") && (
                <button onClick={() => setMode("select")} className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition hover:bg-white/10">
                    <ChevronLeft size={18} /> Back
                </button>
            )}

            {/* VlyxDrive Back (To Download List) */}
            {mode === "vlyxdrive" && (
                <button onClick={() => setMode("download")} className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition hover:bg-white/10">
                    <ChevronLeft size={18} /> Back
                </button>
            )}
        </div>
      </div>

      {/* --- CONDITION: VLYXDRIVE PAGE (Page 3) --- */}
      {mode === "vlyxdrive" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 px-5 max-w-lg mx-auto">
            {/* Tag */}
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Movie • VlyxDrive
            </span>

            {/* Title */}
            <h1 className="text-3xl font-extrabold mt-4 mb-2 leading-tight">
                Akhanda 2: <br/> <span className="text-gray-400">Thaandavam</span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                When all hope died, Akhanda arrived. He saved his family, protected his people, killed the wrongdoers, and retreated into isolation. But years later...
            </p>

            {/* Poster Centered */}
            <div className="w-full flex justify-center mb-8">
                <div className="w-[180px] rounded-lg overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/10">
                    <img src="https://image.tmdb.org/t/p/w500/2w1458e0a7f1a1a1a.jpg" className="w-full h-auto" alt="Poster" />
                </div>
            </div>

            {/* Access Options Section */}
            <h2 className="text-xl font-bold mb-1">Access Options</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span>Watch or Download</span>
                <span className="text-green-500">• {selectedQuality || "1080p HEVC"}</span>
            </div>

            {/* THE CARD (VlyxDrive UI) */}
            <div className="border border-green-800/60 bg-[#050f05] rounded-xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">{selectedQuality} [2.3GB]</h3>
                        <span className="bg-green-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1 inline-block">
                            Selected Quality
                        </span>
                    </div>
                </div>

                {/* Orange Button */}
                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-900/50 active:scale-95 transition">
                    <Eye size={18} /> <Zap size={18} className="fill-white" /> Continue with N-Cloud
                </button>

                <div className="text-center mt-3 flex items-center justify-center gap-1 text-xs text-gray-500 cursor-pointer hover:text-gray-300">
                    <ChevronDown size={12} /> Show 1 more server
                </div>
            </div>

            {/* Bottom Drawer Button */}
            <button className="w-full mt-4 bg-[#111] border border-white/10 text-gray-400 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#222] transition">
                <ChevronDown size={16} /> Show 6 other qualities
            </button>
        </motion.div>

      ) : (
        /* --- NORMAL MOVIE DETAILS UI --- */
        <>
        {/* Hero Section (Original Layout) */}
        <div className="relative w-full pt-24 px-5 flex flex-col items-center md:items-start md:flex-row gap-8">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] -z-10" />
            
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="w-[200px] md:w-[300px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(120,50,255,0.3)] border border-white/10"
            >
               <img src="https://image.tmdb.org/t/p/w500/2w1458e0a7f1a1a1a.jpg" alt="Poster" className="w-full h-auto object-cover" />
            </motion.div>

            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
               <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Akhanda 2 <span className="text-purple-400">(2025)</span></h1>
               <div className="flex items-center justify-center md:justify-start gap-3">
                 <span className="bg-[#fbbf24] text-black px-3 py-1 rounded font-bold text-xs flex items-center gap-1"><Star size={12} fill="black" /> 8.4</span>
                 <span className="border border-white/20 px-3 py-1 rounded text-xs text-gray-300">HQ-HDTC</span>
               </div>
               <p className="text-gray-400 text-sm line-clamp-3 px-2 md:px-0">When all hope died, Akhanda arrived. He saved his family, protected his people, killed the wrongdoers, and retreated into isolation.</p>
            </div>
        </div>

        {/* Dynamic Section */}
        <div className="mt-10 px-5 max-w-lg mx-auto md:mx-0">
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Download & Watch Options</h2>
            </div>

            {/* MODE: SELECT (Round Corner Square Buttons - restored) */}
            {mode === "select" && (
                <div className="grid grid-cols-1 gap-4">
                    {/* Download Button */}
                    <motion.button 
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
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
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
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

            {/* MODE: DOWNLOAD LIST (OLD GRADIENT UI RESTORED) */}
            {mode === "download" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                    <p className="text-center text-sm font-semibold mb-2 text-purple-400">Select Quality</p>
                    {DOWNLOAD_LINKS.map((link, i) => (
                        // Yahan wapas Gradient Style lagaya hai
                        <button 
                            key={i} 
                            onClick={() => handleQualityClick(link.quality)}
                            className="w-full relative overflow-hidden group rounded-lg p-[1px] active:scale-95 transition"
                        >
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

            {/* MODE: WATCH PLAYERS (Original UI) */}
            {mode === "watch" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <p className="text-center text-sm font-semibold mb-2">Choose Your Player</p>
                    {/* Internal Player */}
                    <div className="w-full bg-[#1a0f05] border border-orange-900/50 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-orange-500 transition">
                        <div className="p-3 border-2 border-orange-500 rounded-full text-orange-500">
                            <Play size={32} fill="currentColor" />
                        </div>
                        <h3 className="font-bold text-xl">Play Here</h3>
                        <div className="bg-orange-900/30 text-orange-400 text-[10px] px-3 py-1 rounded-full flex items-center gap-1 border border-orange-800">
                            <AlertCircle size={10} /> May contain ads
                        </div>
                    </div>

                    {/* External Player */}
                    <div className="w-full bg-[#0a0f1a] border border-blue-900/50 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-500 transition">
                        <div className="flex gap-2">
                             <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-lg">VLC</div>
                             <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-lg">MX</div>
                        </div>
                        <h3 className="font-bold text-xl">Play on External Player</h3>
                        <p className="text-xs text-gray-400">Better experience, ad-free</p>
                    </div>
                </motion.div>
            )}
        </div>

        {/* --- CAST & CREW --- */}
        <div className="mt-12 px-5 mb-10">
            <h2 className="text-lg font-bold mb-4 text-center md:text-left">Cast & Crew</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CAST_DATA.map((actor, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-white/10 mb-2">
                        <img src={actor.img} alt={actor.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-bold text-white">{actor.name}</p>
                        <p className="text-[10px] text-gray-400">{actor.role}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
      )}
    </div>
  );
}

// --- DATA ---
const DOWNLOAD_LINKS = [
    { quality: "480p", size: "600MB" },
    { quality: "720p", size: "1.5GB" },
    { quality: "720p HEVC", size: "1GB" },
    { quality: "1080p", size: "3.4GB" },
    { quality: "1080p HEVC", size: "2.3GB" },
    { quality: "1080p HQ", size: "8.8GB" },
];

const CAST_DATA = [
    { name: "Nandamuri Balakrishna", role: "Akhanda / Rudra", img: "https://image.tmdb.org/t/p/w200/hP2stO99sF06i6Xq8D4hE3k.jpg" },
    { name: "Pragya Jaiswal", role: "Saranya", img: "https://image.tmdb.org/t/p/w200/j62dY1k4e.jpg" },
    { name: "Samyuktha", role: "Lead Role", img: "https://image.tmdb.org/t/p/w200/abc.jpg" }, 
    { name: "Aadhi Pinisetty", role: "Villain", img: "https://image.tmdb.org/t/p/w200/def.jpg" },
];
