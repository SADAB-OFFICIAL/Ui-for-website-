'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Types (Ye aapke API data se match karega) ---
interface Movie {
  title: string;
  poster: string;
  slug: string;
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Logic (Jo ab sahi chal raha hai) ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Aapka working API endpoint call ho raha hai
        const res = await fetch('/api/home');
        if (!res.ok) throw new Error("API Failed");
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Home Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    // Navbar Scroll Effect
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">

      {/* --- 1. NAVBAR (Sticky & Glassmorphism) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${
          scrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-red-600 text-2xl md:text-4xl font-bold tracking-tighter cursor-pointer hover:scale-105 transition-transform">
            NETVLYX
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
            <Link href="#" className="hover:text-white transition">Home</Link>
            <Link href="#" className="hover:text-white transition">TV Shows</Link>
            <Link href="#" className="hover:text-white transition">Movies</Link>
            <Link href="#" className="hover:text-white transition">New & Popular</Link>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-200">
          <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-white transition" />
          <div className="w-8 h-8 rounded bg-red-600 cursor-pointer border border-white/20"></div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION (Video Background) --- */}
      <div className="relative w-full h-[80vh] md:h-screen">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <video
                className="w-full h-full object-cover opacity-60 scale-105"
                autoPlay
                muted
                loop
                poster="https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
            >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            </video>
            {/* Cinematic Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl space-y-4 md:space-y-6 z-10">
          <h1 className="text-5xl md:text-7xl font-black drop-shadow-2xl leading-tight tracking-tight">
            INTERSTELLAR
          </h1>
          <p className="text-sm md:text-lg text-gray-200 drop-shadow-md line-clamp-3 font-medium">
             When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold hover:bg-white/90 transition text-lg">
                <Play fill="black" size={22} /> Play
            </button>
            <button className="flex items-center gap-2 bg-gray-500/40 backdrop-blur-md text-white px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold hover:bg-gray-500/60 transition text-lg">
                <Info size={22} /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* --- 3. MOVIES SLIDER (Scraped Data) --- */}
      <div className="relative z-20 -mt-24 md:-mt-32 pl-4 md:pl-12 pb-20 space-y-8">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-100 drop-shadow-md">Latest Releases</h2>

          {/* Loading State (Skeleton) */}
          {loading ? (
             <div className="flex gap-4 overflow-hidden">
                {[1,2,3,4,5,6].map((n) => (
                    <div key={n} className="min-w-[150px] md:min-w-[220px] h-[220px] md:h-[330px] bg-zinc-800 animate-pulse rounded-md" />
                ))}
             </div>
          ) : (
             /* Real Data Row */
             <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8 pr-8 scroll-smooth items-center">
                {movies.map((movie, idx) => (
                    <Link key={idx} href={`/movie/${movie.slug}`}>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                            transition={{ duration: 0.2 }}
                            className="relative min-w-[150px] md:min-w-[220px] h-[220px] md:h-[330px] rounded-md overflow-hidden bg-zinc-900 cursor-pointer shadow-lg group border border-white/5 hover:border-white/20"
                        >
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {/* Hover Details Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-sm font-bold text-center text-white">{movie.title}</p>
                                <div className="flex justify-center mt-2">
                                  <div className="bg-white rounded-full p-2">
                                    <Play fill="black" size={12} className="text-black"/>
                                  </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
