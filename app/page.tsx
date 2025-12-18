'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Types ---
interface Movie {
  title: string;
  poster: string;
  slug: string; // Base64 encoded slug from API
}

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
            {['Home', 'TV Shows', 'Movies', 'New & Popular'].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 text-gray-200">
          <Search className="w-6 h-6 cursor-pointer hover:text-white" />
          <Bell className="w-6 h-6 cursor-pointer hover:text-white" />
          <div className="w-8 h-8 rounded bg-red-600"></div>
        </div>
      </nav>

      {/* --- Hero Section (Static Fallback for Demo) --- */}
      <header className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden group">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <video 
                poster="https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
                autoPlay muted loop 
                className="w-full h-full object-cover opacity-60 scale-105"
            >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:pb-24 flex flex-col justify-end h-full z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl">INTERSTELLAR</h1>
          <p className="text-lg text-gray-200 mb-8 line-clamp-3 drop-shadow-md font-medium">
            Exploring the unknown reaches of the backend integration.
          </p>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-[4px] font-bold hover:bg-white/90 transition text-lg">
                <Play fill="black" size={24} /> Play
             </button>
             <button className="flex items-center gap-2 bg-gray-500/40 backdrop-blur-sm text-white px-8 py-3 rounded-[4px] font-bold hover:bg-gray-500/60 transition text-lg">
                <Info size={24} /> More Info
             </button>
          </div>
        </div>
      </header>

      {/* --- Dynamic Content --- */}
      <main className="relative z-20 -mt-12 md:-mt-32 space-y-12 pb-20 pl-4 md:pl-12 overflow-hidden">
        
        {/* Latest Scraped Movies */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white/90">Latest Releases</h2>
          
          {loading ? (
             <div className="flex gap-4 overflow-hidden">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-[160px] h-[240px] bg-zinc-800 animate-pulse rounded-md flex-none"></div>
                ))}
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
      </main>
    </div>
  );
}
