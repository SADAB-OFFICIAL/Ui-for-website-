'use client';

import React, { useState, useEffect } from 'react';
import { Play, Download, ChevronLeft, HardDrive, ShieldCheck, MonitorPlay, Film, Server, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

// --- Types ---
type ViewState = 'select' | 'download' | 'watch' | 'vlyxdrive';

interface EpisodeLink {
    label: string;
    size: string;
    url: string;
    vlyx_key: string; // The encrypted key needed for VlyxDrive
    res: string;
}

interface ServerLink {
    name: string;
    url: string;
    type: string;
}

export default function MovieDetail() {
    const params = useParams();
    // Decode URI component because base64 might have symbols
    const slug = typeof params.id === 'string' ? params.id : '';
    
    const router = useRouter();
    
    // Data States
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState<ViewState>('select');
    
    // Selection States
    const [selectedLink, setSelectedLink] = useState<EpisodeLink | null>(null);
    const [driveLinks, setDriveLinks] = useState<ServerLink[]>([]);
    const [loadingDrive, setLoadingDrive] = useState(false);

    // --- 1. Fetch Movie Details ---
    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        
        // Call our Scraper API
        fetch(`/api/movie?slug=${slug}`)
            .then(res => res.json())
            .then(resp => {
                if(resp.status && resp.data) {
                    setMovie(resp.data);
                }
            })
            .catch(err => console.error("Error fetching movie:", err))
            .finally(() => setLoading(false));
    }, [slug]);

    // --- 2. Fetch Drive Links (When Quality Selected) ---
    useEffect(() => {
        if (viewState === 'vlyxdrive' && selectedLink) {
            setLoadingDrive(true);
            setDriveLinks([]);
            
            fetch(`/api/vlyxdrive?key=${encodeURIComponent(selectedLink.vlyx_key)}&quality=${selectedLink.res}`)
                .then(res => res.json())
                .then(resp => {
                    if(resp.status && resp.data) {
                        setDriveLinks(resp.data);
                    }
                })
                .finally(() => setLoadingDrive(false));
        }
    }, [viewState, selectedLink]);

    const handleBack = () => {
        if (viewState === 'select') router.push('/');
        else setViewState('select');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 animate-pulse font-medium">Fetching Data from Proxy...</p>
            </div>
        );
    }

    if (!movie) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Content not found or Source Error.</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-y-auto">
            
            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={handleBack} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition border border-white/10">
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="Backdrop" className="w-full h-full object-cover opacity-40 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row gap-8 items-end z-10">
                    <motion.img 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        src={movie.poster} 
                        alt="Poster" 
                        className="w-32 md:w-48 rounded-lg shadow-2xl shadow-black/50 hidden md:block border border-white/10" 
                    />
                    <div className="flex-1 space-y-3 mb-2">
                        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl md:text-5xl font-extrabold tracking-tight">{movie.title}</motion.h1>
                        <div className="flex gap-3 text-sm font-bold text-gray-300 items-center">
                            <span className="text-green-400">98% Match</span>
                            <span className="bg-zinc-800 text-gray-200 px-2 py-0.5 rounded text-[10px] uppercase border border-zinc-700 tracking-wider">
                                {movie.isSeries ? 'Series' : 'Movie'}
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed line-clamp-3">
                            {movie.description || "No description available."}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- INTERACTIVE UI AREA --- */}
            <main className="px-6 md:px-12 py-8 max-w-4xl mx-auto min-h-[400px]">
                <AnimatePresence mode="wait">
                    
                    {/* STATE 1: SELECT */}
                    {viewState === 'select' && (
                        <motion.div 
                            key="select"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-200 border-b border-zinc-800 pb-2">Select Action</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => setViewState('download')} className="group relative bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 p-6 rounded-2xl text-left transition-all duration-300 hover:bg-zinc-900/80">
                                    <div className="bg-purple-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                                        <Download className="text-purple-400 group-hover:text-white" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold">Download File</h3>
                                    <p className="text-xs text-zinc-500 mt-1">Available Qualities: {movie.episodeLinks?.length || 0}</p>
                                </button>

                                <button onClick={() => setViewState('watch')} className="group relative bg-zinc-900 border border-zinc-800 hover:border-green-500/50 p-6 rounded-2xl text-left transition-all duration-300 hover:bg-zinc-900/80">
                                    <div className="bg-green-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                                        <Play className="text-green-400 group-hover:text-white" fill="currentColor" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold">Watch Online</h3>
                                    <p className="text-xs text-zinc-500 mt-1">Stream via V-Cloud</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STATE 2: DOWNLOAD (Real Quality List) */}
                    {viewState === 'download' && (
                        <motion.div 
                            key="download"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                             <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                                <h2 className="text-xl font-semibold">Select Quality</h2>
                                <button onClick={() => setViewState('select')} className="text-sm text-zinc-500 hover:text-white transition">Cancel</button>
                             </div>

                             {movie.episodeLinks && movie.episodeLinks.map((link: EpisodeLink, i: number) => (
                                <button 
                                    key={i} 
                                    onClick={() => { setSelectedLink(link); setViewState('vlyxdrive'); }} 
                                    className="w-full relative group p-[2px] rounded-xl overflow-hidden active:scale-[0.99] transition-transform"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-[#111] h-full w-full rounded-[10px] p-5 flex items-center justify-between border border-zinc-800 group-hover:border-transparent">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-zinc-800 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-zinc-700 transition"><Film size={20} /></div>
                                            <div className="text-left">
                                                <span className="font-bold text-gray-200 block text-sm md:text-base">{link.label}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 border border-zinc-700 px-2 py-1 rounded bg-black">{link.size}</span>
                                    </div>
                                </button>
                             ))}
                        </motion.div>
                    )}

                    {/* STATE 3: VLYXDRIVE (Server Fetching & Display) */}
                    {viewState === 'vlyxdrive' && (
                        <motion.div 
                            key="vlyxdrive"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-8 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                                <ShieldCheck size={14} /> VlyxDrive • Secure Gateway
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-2 text-white">{movie.title}</h2>
                            <p className="text-zinc-400 text-sm mb-6 flex items-center gap-2">
                                <span className="text-white font-bold bg-zinc-800 px-2 rounded border border-zinc-700">{selectedLink?.label}</span>
                            </p>

                            {/* Server List */}
                            <div className="w-full space-y-3">
                                {loadingDrive ? (
                                    <div className="py-8 flex flex-col items-center">
                                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs text-orange-400 mt-2">Connecting to VlyxDrive...</p>
                                    </div>
                                ) : driveLinks.length > 0 ? (
                                    driveLinks.map((server, idx) => (
                                        <a 
                                            key={idx} 
                                            href={server.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-900/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <HardDrive size={18} className="text-orange-400" />
                                                <div className="text-left">
                                                    <p className="font-bold text-sm text-gray-200">{server.name}</p>
                                                    <p className="text-[10px] text-zinc-500">{server.type.toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-zinc-600 group-hover:text-white" />
                                        </a>
                                    ))
                                ) : (
                                    <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm flex items-center justify-center gap-2">
                                        <AlertCircle size={16}/> No Servers Found. Try another quality.
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setViewState('download')} className="mt-6 text-xs font-medium text-zinc-500 flex items-center gap-1.5 hover:text-zinc-300 transition">
                                <Server size={14} /> Change Quality
                            </button>
                        </motion.div>
                    )}

                    {/* STATE 4: WATCH (Same as before but linked to Logic) */}
                    {viewState === 'watch' && (
                        <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                                <h2 className="text-xl font-semibold">Choose Player</h2>
                                <button onClick={() => setViewState('select')} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
                            </div>
                            <div className="bg-zinc-900/50 p-6 rounded-xl text-center border border-zinc-800">
                                <MonitorPlay size={40} className="mx-auto text-zinc-600 mb-3"/>
                                <p className="text-zinc-400 text-sm">Streaming feature coming in NetVlyx Pro.</p>
                                <button onClick={() => setViewState('select')} className="mt-4 px-4 py-2 bg-white text-black text-sm font-bold rounded">Go Back</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
            }
                        
