'use client';

import React, { useState, useEffect } from 'react';
// 👇 Is line mein 'MonitorPlay' add kiya hai
import { Play, Download, ChevronLeft, HardDrive, ShieldCheck, Film, Server, ChevronRight, Loader2, Link as LinkIcon, Eye, MonitorPlay } from 'lucide-react';
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
    
    // Logic States
    const [selectedQuality, setSelectedQuality] = useState<EpisodeLink | null>(null);
    const [providers, setProviders] = useState<ProviderLink[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    
    const [finalLinks, setFinalLinks] = useState<FinalLink[]>([]);
    const [loadingFinal, setLoadingFinal] = useState(false);
    const [selectedProviderName, setSelectedProviderName] = useState("");

    // --- 1. Load Movie Data (Real API) ---
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

    // --- 2. Load VlyxDrive Providers ---
    const handleQualitySelect = (link: EpisodeLink) => {
        setSelectedQuality(link);
        setViewState('vlyxdrive');
        setLoadingProviders(true);
        setProviders([]);

        fetch(`/api/vlyxdrive?key=${encodeURIComponent(link.vlyx_key)}&quality=${link.res}`)
            .then(res => res.json())
            .then(resp => {
                if(resp.status && resp.data) setProviders(resp.data);
            })
            .finally(() => setLoadingProviders(false));
    };

    // --- 3. Load Final Links ---
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

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40}/></div>;
    if (!movie) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Content Unavailable</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-y-auto pb-20">
            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={handleBack} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition border border-white/10">
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[45vh] md:h-[60vh]">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="Backdrop" className="w-full h-full object-cover opacity-30 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex items-end gap-6 z-10">
                    <img src={movie.poster} className="w-28 md:w-48 rounded-lg shadow-2xl hidden md:block border border-white/10" />
                    <div className="mb-2">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none">{movie.title}</h1>
                        <p className="text-gray-400 mt-2 text-sm md:text-base line-clamp-2 max-w-2xl">{movie.description}</p>
                    </div>
                </div>
            </div>

            {/* --- INTERACTIVE AREA --- */}
            <main className="px-4 md:px-12 py-8 max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* 1. SELECT MODE (UPDATED TO MATCH PIC 2) */}
                    {viewState === 'select' && (
                        <motion.div key="select" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8 text-center">
                            
                            {/* Headers */}
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">Download & Watch Options</h2>
                                <p className="text-gray-400 text-sm">Choose how you want to enjoy this content</p>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-200">What would you like to do?</h3>

                            {/* Cards Container */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                
                                {/* Button A: Download */}
                                <button 
                                    onClick={() => setViewState('download')} 
                                    className="group relative bg-[#0f111a] border border-blue-900/40 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-[#131624] hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <Download size={32} className="text-blue-500 group-hover:text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white">Download</h3>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-400">Save to your device</p>
                                    </div>
                                </button>

                                {/* Button B: Watch Online */}
                                <button 
                                    onClick={() => setViewState('watch')} 
                                    className="group relative bg-[#0f1a11] border border-green-900/40 hover:border-green-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-[#132415] hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-900/20 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                        <Eye size={32} className="text-green-500 group-hover:text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white">Watch Online</h3>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-400">Stream instantly</p>
                                    </div>
                                </button>

                            </div>
                        </motion.div>
                    )}

                    {/* 2. QUALITY LIST */}
                    {viewState === 'download' && (
                        <motion.div key="download" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-3">
                            <h2 className="text-xl font-semibold mb-4 border-b border-zinc-800 pb-2">Select Quality</h2>
                            {movie.episodeLinks?.map((link: EpisodeLink, i: number) => (
                                <button key={i} onClick={() => handleQualitySelect(link)} className="w-full bg-[#111] border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:bg-zinc-800 transition">
                                    <div className="flex items-center gap-3">
                                        <Film size={18} className="text-zinc-500"/>
                                        <span className="font-bold">{link.label}</span>
                                    </div>
                                    <span className="text-xs bg-zinc-900 px-2 py-1 rounded border border-zinc-700">{link.size}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* 3. VLYXDRIVE */}
                    {viewState === 'vlyxdrive' && (
                        <motion.div key="vlyxdrive" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center">
                            <div className="flex justify-center mb-4"><ShieldCheck className="text-green-400" size={32}/></div>
                            <h2 className="text-2xl font-bold mb-1">VlyxDrive Secure</h2>
                            <p className="text-zinc-400 text-sm mb-6">Servers for <span className="text-white font-bold">{selectedQuality?.label}</span></p>

                            <div className="space-y-3">
                                {loadingProviders ? (
                                    <div className="py-6 flex flex-col items-center"><Loader2 className="animate-spin text-orange-500" size={30}/><p className="text-xs mt-2 text-zinc-500">Decrypting Links...</p></div>
                                ) : providers.length > 0 ? (
                                    providers.map((p, i) => (
                                        <button key={i} onClick={() => handleProviderSelect(p)} className="w-full bg-zinc-800 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition">
                                            <div className="flex items-center gap-3">
                                                <HardDrive className="text-orange-500"/>
                                                <span className="font-bold">{p.name}</span>
                                            </div>
                                            <ChevronRight className="text-zinc-600"/>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-red-400 text-sm bg-red-900/10 p-4 rounded-lg">No Servers Found</div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 4. FINAL LINKS */}
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

                    {/* 5. WATCH (COMING SOON) */}
                    {viewState === 'watch' && (
                         <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center pt-10">
                            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 max-w-sm mx-auto">
                                {/* FIXED ICON IMPORT */}
                                <MonitorPlay size={48} className="mx-auto text-green-500 mb-4"/>
                                <h3 className="text-xl font-bold text-white mb-2">Streaming Soon</h3>
                                <p className="text-zinc-400 text-sm">We are adding a high-speed player. For now, please use the download option.</p>
                                <button onClick={() => setViewState('select')} className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition">Go Back</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
