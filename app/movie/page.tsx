"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Play, Star, ChevronLeft, Eye, Zap, ChevronDown, Server } from "lucide-react";
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
                <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
                    <ArrowLeft size={18} /> Back
                </button>
                </Link>
            )}

            {/* Internal Back (To Selection) */}
            {(mode === "download" || mode === "watch") && (
                <button onClick={() => setMode("select")} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
                    <ChevronLeft size={18} /> Back
                </button>
            )}

            {/* VlyxDrive Back (To Download List) */}
            {mode === "vlyxdrive" && (
                <button onClick={() => setMode("download")} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
                    <ChevronLeft size={18} /> Back
                </button>
            )}
        </div>
      </div>

      {/* --- VLYXDRIVE UI (SPECIAL PAGE) --- */}
      {mode === "vlyxdrive" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 px-5 max-w-lg mx-auto">
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

            {/* THE CARD (Green Border Style) */}
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
        {/* Hero Section */}
        <div className="relative w-full pt-24 px-5 flex flex-col items-center md:items-start md:flex-row gap-8">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] -z-10" />
            
            <motion.div className="w-[200px] md:w-[300px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(120,50,255,0.3)] border border-white/10">
               <img src="https://image.tmdb.org/t/p/w500/2w1458e0a7f1a1a1a.jpg" alt="Poster" className="w-full h-auto object-cover" />
            </motion.div>

            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
               <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Akhanda 2 <span className="text-purple-400">(2025)</span></h1>
               <div className="flex items-center justify-center md:justify-start gap-3">
                 <span className="bg-[#fbbf24] text-black px-3 py-1 rounded font-bold text-xs flex items-center gap-1"><Star size={12} fill="black" /> 8.4</span>
                 <span className="border border-white/20 px-3 py-1 rounded text-xs text-gray-300">HQ-HDTC</span>
               </div>
               <p className="text-gray-400 text-sm line-clamp-3">When all hope died, Akhanda arrived. He saved his family, protected his people...</p>
            </div>
        </div>

        {/* Dynamic Section */}
        <div className="mt-10 px-5 max-w-lg mx-auto md:mx-0">
            <h2 className="text-lg font-bold mb-4">Download & Watch Options</h2>

            {/* MODE: SELECT (Round Corner Square Buttons) */}
            {mode === "select" && (
                <div className="grid grid-cols-1 gap-4">
                    {/* Round Corner Square Button - Download */}
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("download")}
                        className="w-full bg-[#161616] border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500 transition group"
                    >
                        <div className="bg-purple-600/20 p-3 rounded-lg text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition">
                            <Download size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg text-gray-100">Download</h3>
                            <p className="text-xs text-gray-500">Save to your device</p>
                        </div>
                    </motion.button>

                    {/* Round Corner Square Button - Watch Online */}
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("watch")}
                        className="w-full bg-[#161616] border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:border-green-500 transition group"
                    >
                        <div className="bg-green-600/20 p-3 rounded-lg text-green-500 group-hover:bg-green-600 group-hover:text-white transition">
                            <Play size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg text-gray-100">Watch Online</h3>
                            <p className="text-xs text-gray-500">Stream Instantly</p>
                        </div>
                    </motion.button>
                </div>
            )}

            {/* MODE: DOWNLOAD LIST */}
            {mode === "download" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                    <p className="text-center text-sm font-semibold mb-2 text-purple-400">Select Quality</p>
                    {DOWNLOAD_LINKS.map((link, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleQualityClick(link.quality)}
                            className="w-full bg-[#111] border border-white/10 hover:border-purple-500 p-3 rounded-lg flex justify-between items-center active:scale-95 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Download size={18} className="text-gray-400" />
                                <span className="font-bold text-sm">{link.quality}</span>
                            </div>
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{link.size}</span>
                        </button>
                    ))}
                </motion.div>
            )}

            {/* MODE: WATCH PLAYERS */}
            {mode === "watch" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="w-full bg-[#1a0f05] border border-orange-900/50 rounded-xl p-5 flex flex-col items-center gap-3">
                        <Play size={32} className="text-orange-500" />
                        <h3 className="font-bold">Play Here</h3>
                    </div>
                    <div className="w-full bg-[#0a0f1a] border border-blue-900/50 rounded-xl p-5 flex flex-col items-center gap-3">
                        <Server size={32} className="text-blue-500" />
                        <h3 className="font-bold">External Player</h3>
                    </div>
                </motion.div>
            )}
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
    { quality: "1080p HEVC", size: "2.3GB" },
    { quality: "1080p HQ", size: "8.8GB" },
];
