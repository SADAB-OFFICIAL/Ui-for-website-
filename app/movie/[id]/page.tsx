'use client';

import React, { useState, useEffect } from 'react';
import { Play, Download, ChevronLeft, HardDrive, ShieldCheck, ExternalLink, MonitorPlay, Film, Server, ChevronRight, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

// --- Types ---
type ViewState = 'select' | 'download' | 'watch' | 'vlyxdrive' | 'final_links';

interface EpisodeLink {
    label: string;
    size: string;
    url: string;
    vlyx_key: string; // Encryption key from scraper
    res: string;
}

interface ProviderLink {
    name: string;
    url: string;
    type: string;
}

interface FinalLink {
    name: string;
    url: string;
    type: string;
}

export default function MovieDetail() {
    const params = useParams();
    // Slug handle karna
    const slug = typeof params.id === 'string' ? params.id : '';
    const router = useRouter();

    // --- STATES ---
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState<ViewState>('select');
    
    // Logic States
    const [selectedQuality, setSelectedQuality] = useState<EpisodeLink | null>(null);
    const [providers, setProviders] = useState<ProviderLink[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    
    const [finalLinks, setFinalLinks] = useState<FinalLink[]>([]);
    const [loadingFinal, setLoadingFinal] = useState(false);
    const [selectedProviderName, setSelectedProviderName] = useState("");

    // --- 1. FETCH MOVIE DETAILS ---
    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetch(`/api/movie?slug=${slug}`)
            .then(res => res.json())
            .then(resp => {
                if(resp.status && resp.data) setMovie(resp.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    // --- 2. FETCH VLYXDRIVE (When Quality is Clicked) ---
    const handleQualitySelect = (link: EpisodeLink) => {
        setSelectedQuality(link);
        setViewState('vlyxdrive');
        setLoadingProviders(true);
        setProviders([]);

        // Real API Call
        fetch(`/api/vlyxdrive?key=${encodeURIComponent(link.vlyx_key)}&quality=${link.res}`)
            .then(res => res.json())
            .then(resp => {
                if(resp.status && resp.data) setProviders(resp.data);
            })
            .finally(() => setLoadingProviders(false));
    };

    // --- 3. FETCH FINAL LINKS (When N-Cloud is Clicked) ---
    const handleProviderSelect = (provider: ProviderLink) => {
        if (provider.type === 'gdrive' || provider.type === 'vcloud') {
            window.open(provider.url, '_blank');
            return;
        }

        if (provider.type === 'ncloud') {
            setSelectedProviderName(provider.name);
            setViewState('final_links');
            setLoadingFinal(true);
            setFinalLinks([]);

            // Real API Call (Hops logic)
            fetch(`/api/ncloud?url=${encodeURIComponent(provider.url)}`)
                .then(res => res.json())
                .then(resp => {
                    if(resp.status && resp.servers) setFinalLinks(resp.servers);
                })
                .finally(() => setLoadingFinal(false));
        }
    };

    const handleBack = () => {
        if (viewState === 'final_links') setViewState('vlyxdrive');
        else if (viewState === 'vlyxdrive') setViewState('download');
        else if (viewState === 'download') setViewState('select');
        else if (viewState === 'watch') setViewState('select');
        else router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 animate-pulse font-medium">Loading NetVlyx...</p>
            </div>
        );
    }

    if (!movie) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Movie not found</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-y-auto pb-20">
            
            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={handleBack} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition border border-white/10 group">
                    <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform"/>
                </button>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="Backdrop" className="w-full h-full object-cover opacity-60 blur-sm" />
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
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span>2024</span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span className="bg-zinc-800 text-gray-200 px-2 py-0.5 rounded text-[10px] uppercase border border-zinc-700 tracking-wider">
                                {movie.isSeries ? 'Series' : 'Movie'}
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">
                            {movie.description || "No description available."}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- INTERACTIVE UI AREA --- */}
            <main className="px-6 md:px-12 py-8 max-w-4xl mx-auto min-h-[400px]">
                <AnimatePresence mode="wait">
                    
                    {/* STATE 1: SELECT (User's UI) */}
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
                                <button onClick={() => setViewState('download')} className="group relative bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 p-6 rounded-2xl text-left transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-purple-900/20">
                                    <div className="bg-purple-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                                        <Download className="text-purple-400 group-hover:text-white" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold">Download File</h3>
                                    <p className="text-xs text-zinc-500 mt-1">Available: {movie.episodeLinks?.length || 0} Qualities</p>
                                </button>

                                <button onClick={() => setViewState('watch')} className="group relative bg-zinc-900 border border-zinc-800 hover:border-green-500/50 p-6 rounded-2xl text-left transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-green-900/20">
                                    <div className="bg-green-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                                        <Play className="text-green-400 group-hover:text-white" fill="currentColor" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold">Watch Online</h3>
                                    <p className="text-xs text-zinc-500 mt-1">Instant Stream • Buffer-free</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STATE 2: DOWNLOAD (Real Quality List from Scraper) */}
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
                                <button key={i} onClick={() => handleQualitySelect(link)} className="w-full relative group p-[2px] rounded-xl overflow-hidden active:scale-[0.99] transition-transform">
                                    {/* Gradient Border Trick (Preserved from your code) */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-[#111] h-full w-full rounded-[10px] p-5 flex items-center justify-between border border-zinc-800 group-hover:border-transparent">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-zinc-800 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-zinc-700 transition"><Film size={20} /></div>
                                            <div className="text-left">
                                                <span className="font-bold text-gray-200 block">{link.label}</span>
                                                <span className="text-[10px] text-zinc-500">{link.res} • {link.size}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 border border-zinc-700 px-2 py-1 rounded bg-black">MKV</span>
                                    </div>
                                </button>
                             ))}
                        </motion.div>
                    )}

                    {/* STATE 3: VLYXDRIVE (Showing Real Providers) */}
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

                            <img src={movie.poster} alt="Poster" className="w-24 rounded shadow-2xl mb-4 border border-white/10" />
                            
                            <h2 className="text-2xl font-bold mb-2 text-white">{movie.title}</h2>
                            <p className="text-zinc-400 text-sm mb-8 flex items-center gap-2">
                                Checking servers for <span className="text-white font-bold bg-zinc-800 px-2 rounded border border-zinc-700">{selectedQuality?.label}</span>
                            </p>

                            <div className="w-full space-y-3">
                                {loadingProviders ? (
                                    <div className="py-8 flex flex-col items-center">
                                        <Loader2 className="animate-spin text-orange-500 mb-2"/>
                                        <span className="text-xs text-zinc-500">Decrypting Links...</span>
                                    </div>
                                ) : providers.length > 0 ? (
                                    providers.map((p, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => handleProviderSelect(p)}
                                            className="w-full max-w-sm bg-gradient-to-br from-orange-500 to-yellow-500 text-black font-extrabold py-4 rounded-xl shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] hover:shadow-orange-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-3"
                                        >
                                            <HardDrive size={20} className="text-black/80"/> Continue with {p.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-red-400 text-sm">No servers found for this quality.</div>
                                )}
                            </div>

                            <button onClick={() => setViewState('download')} className="mt-6 text-xs font-medium text-zinc-500 flex items-center gap-1.5 hover:text-zinc-300 transition px-4 py-2 rounded-lg hover:bg-zinc-800/50">
                                <Server size={14} /> Switch Quality
                            </button>
                        </motion.div>
                    )}

                    {/* STATE 4: FINAL LINKS (N-Cloud Result) */}
                    {viewState === 'final_links' && (
                        <motion.div key="final" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="bg-black border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400"><Server className="text-blue-500"/> {selectedProviderName} Results</h2>
                            
                            {loadingFinal ? (
                                <div className="py-10 flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-zinc-500 text-sm animate-pulse">Bypassing restrictions...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {finalLinks.map((link, i) => (
                                        <a key={i} href={link.url} target="_blank" className="block w-full bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl hover:bg-blue-600 hover:text-white transition group">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold flex items-center gap-2"><LinkIcon size={16}/> {link.name}</span>
                                                <span className="text-xs bg-black/30 px-2 py-1 rounded uppercase">{link.type}</span>
                                            </div>
                                            <div className="text-xs text-zinc-500 group-hover:text-blue-200 mt-1 truncate">{link.url}</div>
                                        </a>
                                    ))}
                                    {finalLinks.length === 0 && <p className="text-zinc-500 text-center">No direct links generated.</p>}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STATE 5: WATCH (Players) */}
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
