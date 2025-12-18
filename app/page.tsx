'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Types ---
interface Movie {
  title: string;
  poster: string;
  slug: string;
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data from YOUR API ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) throw new Error("API Failed");
        const data = await res.json();
        // Agar data array hai toh set karo
        if (Array.isArray(data)) {
            setMovies(data);
        }
      } catch (error) {
        console.error("Home Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    // Navbar scroll effect
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden pb-20">

      {/* --- 1. NAVBAR (Red Logo & Icons) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 py-3 flex items-center justify-between ${
          scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
           {/* Mobile Menu Icon */}
           <Menu className="text-white md:hidden mr-2" />
           <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xl">N</div>
           <span className="text-red-600 text-2xl font-bold tracking-tight hidden md:block">NetVlyx</span>
           <span className="text-red-600 text-xl font-bold tracking-tight md:hidden">NetVlyx</span>
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-green-900/40 border border-green-500/30 flex items-center justify-center text-green-500">
             <span className="text-xs">💬</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-red-900/40 border border-red-500/30 flex items-center justify-center text-red-500">
             <Search size={16} />
           </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION (Avatar Style) --- */}
      <div className="relative w-full h-[75vh] md:h-[85vh]">
         {/* Hero Image (Static for Premium Feel) */}
         <div className="absolute inset-0">
            <img 
                src="https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc05475qEvH.jpg" 
                alt="Hero" 
                className="w-full h-full object-cover"
            />
            {/* Gradient Overlay (Bottom se Black fade) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/40 to-transparent" />
         </div>

         {/* Hero Content */}
         <div className="absolute bottom-0 left-0 w-full p-5 md:p-10 z-10 flex flex-col gap-3">
             {/* Badges */}
             <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Trending Now</span>
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">★ 7.8</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">MOVIE</span>
             </div>

             {/* Title */}
             <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
                Avatar: Fire and Ash
             </h1>

             {/* Description */}
             <p className="text-gray-300 text-xs md:text-sm line-clamp-2 max-w-lg drop-shadow-md">
                In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face new challenges.
             </p>

             {/* Buttons */}
             <div className="flex gap-3 mt-2">
                <button className="flex-1 md:flex-none bg-white text-black py-2.5 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                    <Play size={18} fill="black" /> Watch
                </button>
                <button className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 text-white py-2.5 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition">
                    <Info size={18} /> More Info
                </button>
             </div>
         </div>
      </div>

      {/* --- 3. SLIDERS SECTION (Scraped Data) --- */}
      <div className="pl-4 md:pl-10 space-y-8 -mt-6 relative z-20">
        
        {/* Slider 1: Latest Uploads */}
        <section>
           <div className="flex justify-between items-end pr-4 mb-3">
              <h2 className="text-white font-bold text-lg md:text-xl">Latest Uploads</h2>
              <span className="text-xs text-gray-500 cursor-pointer">View All</span>
           </div>

           {/* Horizontal Scroll Container */}
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pr-4">
              {loading ? (
                  /* Loading Skeletons */
                  [1,2,3,4,5].map(n => (
                      <div key={n} className="min-w-[130px] h-[190px] bg-zinc-900 rounded-xl animate-pulse flex-none" />
                  ))
              ) : (
                  /* Real Movie Cards */
                  movies.map((movie, i) => (
                      <Link key={i} href={`/movie/${movie.slug}`} className="flex-none group">
                          <div className="relative min-w-[130px] w-[130px] md:min-w-[160px] h-[190px] md:h-[240px] rounded-xl overflow-hidden bg-zinc-900 shadow-lg">
                              <img 
                                  src={movie.poster} 
                                  alt={movie.title} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                              />
                              {/* Dark Overlay on Hover */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <div className="bg-red-600 p-2 rounded-full">
                                    <Play size={14} fill="white" className="text-white ml-0.5" />
                                  </div>
                              </div>
                          </div>
                          <p className="text-xs text-gray-300 mt-2 font-medium truncate w-[130px]">{movie.title}</p>
                      </Link>
                  ))
              )}
           </div>
        </section>

        {/* Slider 2: What's Popular (Top 10 Style) */}
        <section>
           <h2 className="text-white font-bold text-lg md:text-xl mb-3">What's Popular in India</h2>
           
           <div className="flex gap-0 overflow-x-auto no-scrollbar pb-4 pr-4 items-center">
              {!loading && movies.slice(0, 10).map((movie, i) => (
                  <Link key={i} href={`/movie/${movie.slug}`} className="flex-none relative mr-4 group flex items-end">
                      {/* Big SVG Number */}
                      <div className="h-[140px] w-[60px] md:h-[180px] md:w-[80px] flex items-end justify-end -mr-4 z-0 pointer-events-none relative top-2">
                        <svg viewBox="0 0 70 100" className="h-full w-full overflow-visible">
                            <text x="10" y="100" fontSize="130" fontWeight="900" 
                                  stroke="#555" strokeWidth="2" fill="black" 
                                  style={{ fontFamily: 'sans-serif' }}>
                                {i + 1}
                            </text>
                        </svg>
                      </div>

                      {/* Poster */}
                      <div className="min-w-[110px] w-[110px] md:min-w-[140px] h-[160px] md:h-[210px] rounded-lg overflow-hidden z-10 shadow-lg border border-white/10">
                         <img 
                            src={movie.poster} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                         />
                      </div>
                  </Link>
              ))}
           </div>
        </section>

        {/* Slider 3: Latest Hollywood (Using same data for demo) */}
        <section className="pb-10">
           <div className="flex justify-between items-end pr-4 mb-3">
              <h2 className="text-white font-bold text-lg md:text-xl">Latest Hollywood Movies</h2>
              <span className="text-xs text-gray-500 cursor-pointer">View All</span>
           </div>

           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pr-4">
              {!loading && [...movies].reverse().map((movie, i) => (
                   <Link key={i} href={`/movie/${movie.slug}`} className="flex-none">
                      <div className="relative min-w-[130px] w-[130px] md:min-w-[160px] h-[190px] md:h-[240px] rounded-xl overflow-hidden bg-zinc-900">
                          <img src={movie.poster} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-gray-300 mt-2 font-medium truncate w-[130px]">{movie.title}</p>
                   </Link>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
      }
