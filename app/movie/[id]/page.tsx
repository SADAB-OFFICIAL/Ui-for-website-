"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // ID pakadne ke liye
import { ArrowLeft, Download, Play, Star, ChevronLeft, Eye, Zap, ChevronDown, Server, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieDetail() {
  const params = useParams(); // URL se ID milegi (eg: fallout-123)
  const movieID = params.id; 

  const [mode, setMode] = useState("select");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [movieData, setMovieData] = useState<any>(null); // Data store karne ke liye

  // --- SIMULATE API FETCH FROM SADABEFY ---
  useEffect(() => {
    // Asli code mein tum yahan: fetch(`/api/sadabefy/info?id=${movieID}`) karoge
    // Abhi main demo data set kar raha hun taki UI na toote
    setTimeout(() => {
      setMovieData({
        title: "Akhanda 2",
        subtitle: "Thaandavam",
        year: "2025",
        desc: "When all hope died, Akhanda arrived. He saved his family...",
        poster: "https://image.tmdb.org/t/p/w500/2w1458e0a7f1a1a1a.jpg",
        rating: "8.4",
        qualities: [
            { quality: "480p", size: "600MB", link: "magnet:?xt=..." },
            { quality: "720p", size: "1.5GB", link: "magnet:?xt=..." },
            { quality: "1080p", size: "3.4GB", link: "magnet:?xt=..." }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [movieID]);

  const handleQualityClick = (quality: string) => {
    setSelectedQuality(quality);
    setMode("vlyxdrive");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
      
      {/* --- BACK BUTTON LOGIC --- */}
      <div className="fixed top-0 w-full z-50 p-4 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-2">
            {mode === "select" && (
                <Link href="/">
                <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
                    <ArrowLeft size={18} /> Back
                </button>
                </Link>
            )}
            {(mode === "download" || mode === "watch") && (
                <button onClick={() => setMode("select")} className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
                    <ChevronLeft size={18} /> Back
                </button>
            )}
            {mode === "vlyxdrive" && (
                <button onClick={() => setMode("download")} className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold active:scale-95 transition">
                    <ChevronLeft size={18} /> Back
                </button>
            )}
        </div>
      </div>

      {/* --- VLYXDRIVE UI --- */}
      {mode === "vlyxdrive" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 px-5 max-w-lg mx-auto">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                VlyxDrive
            </span>

            {/* Dynamic Title */}
            <h1 className="text-3xl font-extrabold mt-4 mb-2 leading-tight">
                {movieData.title}: <br/> <span className="text-gray-400">{movieData.subtitle}</span>
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {movieData.desc}
            </p>

            <div className="w-full flex justify-center mb-8">
                <div className="w-[180px] rounded-lg overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/10">
                    <img src={movieData.poster} className="w-full h-auto" alt="Poster" />
                </div>
            </div>

            <div className="border border-green-800/60 bg-[#050f05] rounded-xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">{selectedQuality}</h3>
                        <span className="bg-green-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1 inline-block">
                            Selected Quality
                        </span>
                    </div>
                </div>

                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-900/50 active:scale-95 transition">
                    <Eye size={18} /> <Zap size={18} className="fill-white" /> Continue with N-Cloud
                </button>
            </div>
        </motion.div>

      ) : (
        /* --- NORMAL UI --- */
        <>
        <div className="relative w-full pt-24 px-5 flex flex-col items-center md:items-start md:flex-row gap-8">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] -z-10" />
            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-[200px] md:w-[300px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(120,50,255,0.3)] border border-white/10">
               <img src={movieData.poster} alt="Poster" className="w-full h-auto object-cover" />
            </motion.div>

            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
               <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{movieData.title} <span className="text-purple-400">({movieData.year})</span></h1>
               <div className="flex items-center justify-center md:justify-start gap-3">
                 <span className="bg-[#fbbf24] text-black px-3 py-1 rounded font-bold text-xs flex items-center gap-1"><Star size={12} fill="black" /> {movieData.rating}</span>
                 <span className="border border-white/20 px-3 py-1 rounded text-xs text-gray-300">HQ-HDTC</span>
               </div>
               <p className="text-gray-400 text-sm line-clamp-3 px-2 md:px-0">{movieData.desc}</p>
            </div>
        </div>

        <div className="mt-10 px-5 max-w-lg mx-auto md:mx-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Download & Watch Options</h2>
            </div>

            {mode === "select" && (
                <div className="grid grid-cols-1 gap-4">
                    <motion.button onClick={() => setMode("download")} className="w-full bg-[#111] border border-gray-800 p-5 rounded-2xl flex items-center gap-4 active:scale-95 transition hover:border-purple-500/50 group">
                        <div className="p-3 bg-purple-900/20 rounded-full group-hover:bg-purple-600 transition duration-300">
                            <Download size={24} className="text-purple-500 group-hover:text-white" />
                        </div>
                        <div className="text-left"><h3 className="font-bold text-lg">Download</h3><p className="text-gray-500 text-xs">Save to your device</p></div>
                    </motion.button>

                    <motion.button onClick={() => setMode("watch")} className="w-full bg-[#051005] border border-green-900/30 p-5 rounded-2xl flex items-center gap-4 active:scale-95 transition hover:border-green-500/50 group">
                        <div className="p-3 bg-green-900/20 rounded-full group-hover:bg-green-600 transition duration-300">
                            <Play size={24} className="text-green-500 group-hover:text-white" />
                        </div>
                        <div className="text-left"><h3 className="font-bold text-lg">Watch Online</h3><p className="text-gray-500 text-xs">Stream Instantly</p></div>
                    </motion.button>
                </div>
            )}

            {mode === "download" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                    <p className="text-center text-sm font-semibold mb-2 text-purple-400">Select Quality</p>
                    {/* DYNAMIC LIST FROM SADABEFY API */}
                    {movieData.qualities.map((item: any, i: number) => (
                        <button key={i} onClick={() => handleQualityClick(item.quality)} className="w-full relative overflow-hidden group rounded-lg p-[1px] active:scale-95 transition">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80 group-hover:opacity-100 transition" />
                            <div className="relative bg-black/20 backdrop-blur-sm hover:bg-transparent transition h-full flex items-center justify-between px-4 py-3 rounded-lg text-white">
                                <div className="flex items-center gap-3"><Download size={18} /><span className="font-bold">{item.quality}</span></div>
                                <span className="text-xs bg-black/40 px-2 py-1 rounded text-gray-200">{item.size}</span>
                            </div>
                        </button>
                    ))}
                </motion.div>
            )}

            {mode === "watch" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <p className="text-center text-sm font-semibold mb-2">Choose Your Player</p>
                    <div className="w-full bg-[#1a0f05] border border-orange-900/50 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-orange-500 transition">
                        <Play size={32} className="text-orange-500" />
                        <h3 className="font-bold text-xl">Play Here</h3>
                    </div>
                </motion.div>
            )}
        </div>
        </>
      )}
    </div>
  );
      }
