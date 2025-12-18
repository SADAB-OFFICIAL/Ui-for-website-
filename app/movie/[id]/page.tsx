'use client';

import React, { useState, useEffect } from 'react';
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

    // --- 1. Load Movie Data ---
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
        <div className="min-h-screen bg-[#000] text-white font-sans overflow-y-auto pb-20 selection:bg-red-600 selection:text-white">
            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <button onClick={handleBack} className="bg-black/50 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition border border-white/10 shadow-lg">
                    <ChevronLeft size={24} className="text-white"/>
                </button>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[45vh] md:h-[60vh]">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="Backdrop" className="w-full h-full object-cover opacity-50 blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex items-end gap-6 z-10">
                    <img src={movie.poster} className="w-28 md:w-48 rounded-xl shadow-2xl hidden md:block border-2 border-white/10" />
                    <div className="mb-2">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg">{movie.title}</h1>
                        <p className="text-gray-300 mt-2 text-sm md:text-base line-clamp-2 max-w-2xl font-medium">{movie.description}</p>
                    </div>
                </div>
            </div>

            {/* --- INTERACTIVE AREA --- */}
            <main className="px-4 md:px-12 py-6 max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* 1. SELECT MODE (COLORFUL BUTTONS) */}
                    {viewState === 'select' && (
                        <motion.div key="select" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8 text-center">
                            
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-white">Select Action</h2>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">Choose Your Path</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                                
                                {/* Button A: Download (Vibrant Blue) */}
                                <button 
                                    onClick={() => setViewState('download')} 
                                    className="group relative bg-gradient-to-br from-blue-600 to-blue-900 border border-blue-400/30 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)]"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        <Download size={28} className="text-white group-hover:text-blue-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xl font-bold text-white">Download</h3>
                                        <p className="text-xs text-blue-200">Save to Gallery</p>
                                    </div>
                                </button>

                                {/* Button B: Watch Online (Vibrant Green) */}
                                <button 
                                    onClick={() => setViewState('watch')} 
                                    className="group relative bg-gradient-to-br from-green-600 to-green-900 border border-green-400/30 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-[0_10px_40px_-10px_rgba(34,197,94,0.5)]"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-green-600 transition-colors">
                                        <Eye size={28} className="text-white group-hover:text-green-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xl font-bold text-white">Watch Online</h3>
                                        <p className="text-xs text-green-200">Stream Now</p>
                                    </div>
                                </button>

                            </div>
                        </motion.div>
                    )}

                    {/* 2. QUALITY LIST (FIXED: NOW DARK & MODERN) */}
                    {viewState === 'download' && (
                        <motion.div key="download" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-3">
                             <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                                <h2 className="text-xl font-semibold text-white">Select Quality</h2>
                                <button onClick={() => setViewState('select')} className="text-sm text-red-500 font-bold hover:text-red-400">Cancel</button>
                             </div>

                             <div className="space-y-3">
                                {movie.episodeLinks?.map((link: EpisodeLink, i: number) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleQualitySelect(link)} 
                                        className="w-full bg-[#161616] border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:bg-zinc-800 hover:border-white/20 transition-all group shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-black rounded-lg text-zinc-400 group-hover:text-white border border-zinc-800 group-hover:border-zinc-600 transition">
                                                <Film size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-bold text-gray-200 text-sm md:text-base block group-hover:text-white">{link.label}</span>
                                                <span className="text-[10px] md:text-xs text-zinc-500">{link.res} • {link.size}</span>
                                            </div>
                                        </div>
                                        <div className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded border border-zinc-700 group-hover:border-white/50">
                                            GET
                                        </div>
                                    </button>
                                ))}
                             </div>
                        </motion.div>
                    )}

                    {/* 3. VLYXDRIVE */}
                    {viewState === 'vlyxdrive' && (
                        <motion.div key="vlyxdrive" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
                            <div className="flex justify-center mb-6">
                                <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20 shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)]">
                                    <ShieldCheck className="text-green-500" size={40}/>
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-2 text-white">VlyxDrive Secure</h2>
                            <p className="text-gray-400 text-sm mb-8">
                                Finding best servers for <span className="text-white font-bold">{selectedQuality?.label}</span>
                            </p>

                            <div className="space-y-3">
                                {loadingProviders ? (
                                    <div className="py-8 flex flex-col items-center">
                                        <Loader2 className="animate-spin text-blue-500 mb-3" size={32}/>
                                        <span className="text-xs text-zinc-500 animate-pulse">Decrypting secure links...</span>
                                    </div>
                                ) : providers.length > 0 ? (
                                    providers.map((p, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => handleProviderSelect(p)} 
                                            className="w-full bg-gradient-to-r from-zinc-900 to-black border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-600/10 p-2 rounded text-blue-500">
                                                    <HardDrive size={20}/>
                                                </div>
                                                <span className="font-bold text-gray-200">{p.name}</span>
                                            </div>
                                            <ChevronRight className="text-zinc-600 group-hover:text-white transition"/>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-red-400 text-sm bg-red-900/10 p-4 rounded-lg border border-red-900/20">
                                        No Servers Found. Try another quality.
                                    </div>
                                )}
                            </div>
                            
                            <button onClick={() => setViewState('download')} className="mt-8 text-xs text-zinc-500 hover:text-white underline decoration-zinc-700">
                                Choose different quality
                            </button>
                        </motion.div>
                    )}

                    {/* 4. FINAL LINKS */}
                    {viewState === 'final_links' && (
                        <motion.div key="final" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-blue-400 border-b border-zinc-900 pb-4">
                                <Server size={24}/> {selectedProviderName} Links
                            </h2>
                            
                            {loadingFinal ? (
                                <div className="py-12 flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-zinc-500 text-sm animate-pulse">Bypassing restrictions...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {finalLinks.map((link, i) => (
                                        <a key={i} href={link.url} target="_blank" className="block w-full bg-[#111] border border-zinc-800 p-4 rounded-xl hover:bg-blue-900/10 hover:border-blue-500/50 transition-all group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold flex items-center gap-2 text-gray-200 group-hover:text-blue-400">
                                                    <LinkIcon size={16}/> {link.name}
                                                </span>
                                                <span className="text-[10px] bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded border border-blue-900/30 uppercase font-bold">{link.type}</span>
                                            </div>
                                            <div className="text-xs text-zinc-600 group-hover:text-zinc-400 truncate font-mono">{link.url}</div>
                                        </a>
                                    ))}
                                    {finalLinks.length === 0 && <p className="text-zinc-500 text-center py-4">No direct links generated.</p>}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 5. WATCH */}
                    {viewState === 'watch' && (
                         <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center pt-10">
                            <div className="bg-[#111] p-8 rounded-3xl border border-zinc-800 max-w-sm mx-auto shadow-2xl">
                                <div className="bg-green-500/10 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                                    <MonitorPlay size={40} className="text-green-500"/>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Streaming Soon</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    We are integrating a high-speed HLS player. For now, please use the <span className="text-blue-400">Download</span> option.
                                </p>
                                <button onClick={() => setViewState('select')} className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition shadow-lg">
                                    Go Back
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
                            }
