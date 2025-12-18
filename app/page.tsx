'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell, Menu, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Types
interface Movie {
  title: string;
  poster: string;
  slug: string;
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. DATA FETCHING
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/home');
        const data = await res.json();
        if (Array.isArray(data)) setMovies(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans pb-20 overflow-x-hidden">

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 py-4 flex items-center justify-between ${
          scrolled ? 'bg-black/95 shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}>
        <div className="flex items-center gap-4">
          <Menu className="md:hidden text-white" />
          <h1 className="text-red-600 text-2xl md:text-3xl font-extrabold tracking-tighter">NETVLYX</h1>
          <div className="hidden md:flex gap-4 text-sm text-gray-300 ml-6">
            <Link href="#" className="hover:text-white font-medium">Home</Link>
            <Link href="#" className="hover:text-white font-medium">TV Shows</Link>
            <Link href="#" className="hover:text-white font-medium">Movies</Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Search className="w-6 h-6 text-white cursor-pointer" />
          <div className="w-8 h-8 rounded bg-red-600"></div>
        </div>
      </nav>

      {/* --- HERO SECTION (Avatar Style) --- */}
      <div className="relative w-full h-[600px] md:h-[80vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
            <img 
                src="https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc05475qEvH.jpg" 
                alt="Hero" 
                className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 flex flex-col gap-4 max-w-2xl">
            <span className="text-gray-300 tracking-widest uppercase text-xs font-bold bg-black/40 w-fit px-2 py-1 rounded border border-white/20">
                #1 in Movies Today
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-none">
                AVATAR
            </h1>
            <p className="text-white text-lg font-medium drop-shadow-md">The Way of Water</p>
            <p className="text-gray-200 text-sm md:text-base line-clamp-2 drop-shadow-md max-w-lg">
                Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.
            </p>
            
            <div className="flex gap-3 mt-2">
                <button className="bg-white text-black px-8 py-2.5 rounded font-bold flex items-center gap-2 hover:bg-gray-200 transition">
                    <Play fill="black" size={20} /> Play
                </button>
                <button className="bg-gray-500/40 backdrop-blur text-white px-8 py-2.5 rounded font-bold flex items-center gap-2 hover:bg-gray-500/50 transition">
                    <Info size={20} /> More Info
                </button>
            </div>
        </div>
      </div>

      {/* --- MOVIES SLIDER SECTION --- */}
      <div className="pl-4 md:pl-12 -mt-16 md:-mt-24 relative z-20 space-y-8">
        
        {/* Slider 1 */}
        <div>
            <h2 className="text-white text-lg md:text-xl font-bold mb-3 flex items-center gap-2 group cursor-pointer">
                Latest Releases <ChevronRight className="text-red-500 opacity-0 group-hover:opacity-100 transition" size={20}/>
            </h2>
            
            {/* SCROLL CONTAINER */}
            <div className="flex gap-3 overflow-x-scroll no-scrollbar pb-4 pr-4">
                {loading ? (
                    // Skeleton Loading
                    [1,2,3,4,5,6].map(n => (
                        <div key={n} className="min-w-[140px] h-[200px] bg-zinc-800 rounded animate-pulse flex-none" />
                    ))
                ) : (
                    // Movie Cards
                    movies.map((movie, i) => (
                        <Link key={i} href={`/movie/${movie.slug}`} className="flex-none group relative">
                            <div className="min-w-[140px] w-[140px] md:min-w-[180px] h-[200px] md:h-[260px] rounded-md overflow-hidden bg-zinc-900 transition-transform duration-300 group-hover:scale-105 group-hover:z-10 shadow-lg">
                                <img 
                                    src={movie.poster} 
                                    alt={movie.title} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <div className="bg-white p-3 rounded-full">
                                        <Play fill="black" className="text-black" size={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
