'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Types ---
interface Movie {
  title: string;
  poster: string; // API "poster" bhejta hai, "image" nahi
  slug: string;   // API "slug" bhejta hai, "id" nahi
}

const HERO_MOVIE = {
  title: "INTERSTELLAR",
  description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
};

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Real Data ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/home');
        const data = await res.json();
        if (Array.isArray(data)) {
          setMovies(data);
        }
      } catch (error) {
        console.error("Failed to fetch home:", error);
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
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${
          scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-red-600 text-3xl font-bold tracking-tighter hover:scale-105 transition-transform">
            NetVlyx
          </Link>
          <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
            {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-200">
          <Search className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
          <Bell className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
          <div className="w-8 h-8 rounded bg-red-600 cursor-pointer overflow-hidden border border-white/20">
             {/* Dicebear Avatar */}
             <div className="w-full h-full bg-zinc-800"></div>
          </div>
          <Menu className="md:hidden w-6 h-6 cursor-pointer" />
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden group">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <video 
                poster="https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
                autoPlay muted loop 
                className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[2s]"
            >
                <source src={HERO_MOVIE.videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:pb-24 flex flex-col justify-end h-full z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl"
          >
            {HERO_MOVIE.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-200 mb-8 line-clamp-3 drop-shadow-md font-medium"
          >
            {HERO_MOVIE.description}
          </motion.p>
          
          <div className="flex gap-4">
             {/* Agar API data load ho gaya to first movie play hogi */}
            <Link href={movies.length > 0 ? `/movie/${movies[0].slug}` : '#'}>
                <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-[4px] font-bold hover:bg-white/90 transition text-lg active:scale-95">
                <Play fill="black" size={24} /> Play
                </button>
            </Link>
            <button className="flex items-center gap-2 bg-gray-500/40 backdrop-blur-sm text-white px-8 py-3 rounded-[4px] font-bold hover:bg-gray-500/60 transition text-lg">
              <Info size={24} /> More Info
            </button>
          </div>
        </div>
      </header>

      {/* --- Sliders --- */}
      <main className="relative z-20 -mt-12 md:-mt-32 space-y-12 pb-20 pl-4 md:pl-12 overflow-hidden">
        
        {/* 1. Latest Releases (Real Data) */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white/90">Latest Releases</h2>
          
          {loading ? (
             <div className="flex gap-4 overflow-hidden">
                {[1,2,3,4,5].map(i => <div key={i} className="w-[160px] h-[240px] bg-zinc-800 animate-pulse rounded-md flex-none"></div>)}
             </div>
          ) : (
            <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8 pr-8 scroll-smooth">
                {movies.map((movie, idx) => (
                <Link key={idx} href={`/movie/${movie.slug}`} className="flex-none group relative">
                    <motion.div 
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        className="w-[160px] md:w-[220px] aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 cursor-pointer shadow-lg transition-shadow"
                    >
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center flex-col p-2 text-center">
                        <p className="font-bold text-sm line-clamp-2">{movie.title}</p>
                        <p className="text-green-400 text-xs font-semibold mt-1">98% Match</p>
                        <div className="mt-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                            <Play fill="black" size={16} className="text-black ml-1" />
                        </div>
                    </div>
                    </motion.div>
                </Link>
                ))}
            </div>
          )}
        </section>

        {/* 2. Top 10 (Using Same Data for Demo) */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white/90">Top 10 Movies Today</h2>
          <div className="flex gap-0 overflow-x-scroll no-scrollbar pb-8 pr-8 items-center">
            {movies.slice(0, 10).map((movie, index) => (
              <Link key={index} href={`/movie/${movie.slug}`} className="flex-none group relative flex items-center mr-6">
                
                {/* SVG Number */}
                <div className="h-[160px] md:h-[220px] w-[90px] flex items-end justify-end -mr-6 z-0 pointer-events-none">
                   <svg viewBox="0 0 100 150" className="h-full w-full overflow-visible">
                        <text x="50%" y="150" fontSize="160" fontWeight="bold" stroke="#555" strokeWidth="4" fill="#000" style={{ fontFamily: 'Impact, sans-serif' }}>
                            {index + 1}
                        </text>
                   </svg>
                </div>

                {/* Movie Card */}
                <motion.div 
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="w-[130px] md:w-[150px] aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 cursor-pointer shadow-lg z-10"
                >
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
