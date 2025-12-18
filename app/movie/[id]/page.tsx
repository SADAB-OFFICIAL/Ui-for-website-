'use client';

import React, { useState, useEffect } from 'react';
import { Play, Download, ChevronLeft, HardDrive, ShieldCheck, Film, Server, ChevronRight, Loader2, Link as LinkIcon, Eye, MonitorPlay, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

// --- Types ---
type ViewState = 'select' | 'download' | 'watch' | 'vlyxdrive' | 'final_links';

interface EpisodeLink {
    label: string;
    size: string;
    url: string;
    vlyx_key: string;
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
    const slug = typeof params.id === 'string' ? params.id : '';
    const router = useRouter();
    
    // --- States ---
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState<ViewState>('select');
    
    const [selectedQuality, setSelectedQuality] = useState<EpisodeLink | null>(null);
    const [providers, setProviders] = useState<ProviderLink[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    
    const [finalLinks, setFinalLinks] = useState<FinalLink[]>([]);
    const [loadingFinal, setLoadingFinal] = useState(false);
    const [selectedProviderName, setSelectedProviderName] = useState("");

    // --- 1. Load Data ---
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

    // --- Handlers ---
    const handleQualitySelect = (link: EpisodeLink) => {
        setSelectedQuality(link);
        setViewState('vlyxdrive');
        setLoadingProviders(true);
        setProviders([]);
        fetch(`/api/vlyxdrive?key=${encodeURIComponent(link.vlyx_key)}&quality=${link.res}`)
            .then(res => res.json())
            .then(resp => { if(resp.status && resp.data) setProviders(resp.data); })
            .finally(() => setLoadingProviders(false));
    };

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
            fetch(`/api/ncloud?url=${encodeURIComponent(provider.url)}`)
                .then(res => res.json())
                .then(resp => { if(resp.status && resp.servers) setFinalLinks(resp.servers); })
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

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40}/></div>;
    if (!movie) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Content Unavailable</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-y-auto pb-20">
            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={handleBack} className="bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition">
                    <ChevronLeft size={24} className="text-white"/>
                </button>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="Backdrop" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex items-end gap-6 z-10">
                    <img src={movie.poster} className="w-32 md:w-48 rounded-xl shadow-2xl hidden md:block border-2 border-white/20" />
                    <div className="mb-2">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md">{movie.title}</h1>
                        <p className="text-gray-300 mt-2 text-sm line-clamp-2 max-w-xl">{movie.description}</p>
                    </div>
                </div>
            </div>

            {/* --- ACTION AREA --- */}
            <main className="px-4 md:px-12 py-8 max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* 1. SELECT MODE (VIBRANT BUTTONS) */}
                    {viewState === 'select' && (
                        <motion.div key="select" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-6 text-center">
                            
                            <h2 className="text-2xl font-bold text-white mb-6">Choose Action</h2>

                            <div className="grid grid-cols-1 gap-5">
                                {/* Download Button - VIBRANT BLUE */}
                                <button 
                                    onClick={() => setViewState('download')} 
                                    className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-[1.02] border border-blue-400/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-full">
                                            <Download size={28} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">Download Now</h3>
                                            <p className="text-blue-100 text-xs">Save to Gallery • High Speed</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-white/50" />
                                </button>

                                {/* Watch Button - VIBRANT GREEN */}
                                <button 
                                    onClick={() => setViewState('watch')} 
                                    className="w-full bg-green-600 hover:bg-green-500 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-[1.02] border border-green-400/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-full">
                                            <Play size={28} className="text-white fill-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white">Watch Online</h3>
                                            <p className="text-green-100 text-xs">Stream Instantly • No Ads</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-white/50" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. QUALITY LIST */}
                    {viewState === 'download' && (
                        <motion.div key="download" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                             <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-2">
                                <h2 className="text-xl font-bold">Select Quality</h2>
                                <button onClick={() => setViewState('select')} className="text-sm text-red-500 font-bold">Cancel</button>
                             </div>
                             
                             <div className="space-y-3">
                                {movie.episodeLinks?.map((link: EpisodeLink, i: number) => (
                                    <button key={i} onClick={() => handleQualitySelect(link)} className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl flex justify-between items-center hover:bg-zinc-800 hover:border-blue-500 transition-all">
                                        <div className="flex items-center gap-3">
                                            <Film size={20} className="text-zinc-400"/>
                                            <div className="text-left">
                                                <span className="font-bold text-white block text-sm">{link.label}</span>
                                                <span className="text-xs text-zinc-500">{link.size}</span>
                                            </div>
                                        </div>
                                        <Download size={18} className="text-blue-500"/>
                                    </button>
                                ))}
                             </div>
                        </motion.div>
                    )}

                    {/* 3. VLYXDRIVE */}
                    {viewState === 'vlyxdrive' && (
                        <motion.div key="vlyxdrive" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center shadow-2xl">
                            <ShieldCheck size={48} className="text-green-500 mx-auto mb-4"/>
                            <h2 className="text-xl font-bold mb-6">Secure VlyxDrive Servers</h2>
                            
                            <div className="space-y-3">
                                {loadingProviders ? (
                                    <div className="py-8"><Loader2 className="animate-spin text-blue-500 mx-auto"/><p className="text-xs mt-2 text-zinc-400">Fetching links...</p></div>
                                ) : providers.length > 0 ? (
                                    providers.map((p, i) => (
                                        <button key={i} onClick={() => handleProviderSelect(p)} className="w-full bg-black border border-zinc-700 p-4 rounded-xl flex items-center justify-between hover:border-green-500 transition">
                                            <div className="flex items-center gap-3">
                                                <HardDrive size={20} className="text-green-500"/>
                                                <span className="font-bold">{p.name}</span>
                                            </div>
                                            <ChevronRight size={18} className="text-zinc-500"/>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-red-400 text-sm">No servers found.</div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 4. FINAL LINKS */}
                    {viewState === 'final_links' && (
                        <motion.div key="final" initial={{opacity:0}} animate={{opacity:1}} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4 flex gap-2 text-blue-400"><Server/> {selectedProviderName} Links</h2>
                            {loadingFinal ? (
                                <div className="py-8 text-center"><Loader2 className="animate-spin text-blue-500 mx-auto"/><p className="text-xs mt-2 text-zinc-500">Generating direct links...</p></div>
                            ) : (
                                <div className="space-y-3">
                                    {finalLinks.map((link, i) => (
                                        <a key={i} href={link.url} target="_blank" className="block bg-zinc-900 border border-zinc-700 p-3 rounded-lg hover:bg-blue-900/20 hover:border-blue-500 transition">
                                            <div className="flex justify-between"><span className="font-bold text-sm text-white">{link.name}</span><span className="text-[10px] bg-blue-900 text-blue-200 px-1 rounded">{link.type}</span></div>
                                            <div className="text-[10px] text-zinc-500 truncate mt-1">{link.url}</div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 5. WATCH */}
                    {viewState === 'watch' && (
                        <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-10">
                            <MonitorPlay size={60} className="text-zinc-700 mx-auto mb-4"/>
                            <h3 className="text-xl font-bold">Player Loading...</h3>
                            <p className="text-zinc-500 text-sm mt-2">Streaming servers are being optimized.</p>
                            <button onClick={() => setViewState('select')} className="mt-6 text-blue-500 underline">Go Back</button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
