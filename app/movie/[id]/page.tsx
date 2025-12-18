'use client';

import React, { useState, useEffect } from 'react';
import { Play, Download, ChevronLeft, HardDrive, ShieldCheck, Film, Server, ChevronRight, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

// --- Types ---
type ViewState = 'select' | 'download' | 'vlyxdrive' | 'final_links';

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
    const [providers, setProviders] = useState<ProviderLink[]>([]); // N-Cloud, G-Drive list
    const [loadingProviders, setLoadingProviders] = useState(false);
    
    const [finalLinks, setFinalLinks] = useState<FinalLink[]>([]); // Pixel, FSL list
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

    // --- 2. Load VlyxDrive Providers (Click on Quality) ---
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

    // --- 3. Load Final N-Cloud Links (Click on N-Cloud) ---
    const handleProviderSelect = (provider: ProviderLink) => {
        // Agar G-Drive ya V-Cloud hai toh direct khol do (abhi ke liye)
        if (provider.type === 'gdrive' || provider.type === 'vcloud') {
            window.open(provider.url, '_blank');
            return;
        }

        // Agar N-Cloud hai, toh API call karo
        if (provider.type === 'ncloud') {
            setSelectedProviderName(provider.name);
            setViewState('final_links');
            setLoadingFinal(true);
            setFinalLinks([]);

            // URL pass kar rahe hain API ko
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
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="Backdrop" className="w-full h-full object-cover opacity-30 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex items-end gap-8 z-10">
                    <img src={movie.poster} className="w-32 md:w-48 rounded-lg shadow-2xl hidden md:block border border-white/10" />
                    <div className="mb-2">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{movie.title}</h1>
                        <p className="text-gray-400 mt-2 line-clamp-2 max-w-2xl">{movie.description}</p>
                    </div>
                </div>
            </div>

            {/* --- INTERACTIVE CARD --- */}
            <main className="px-6 md:px-12 py-8 max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* 1. SELECT MODE */}
                    {viewState === 'select' && (
                        <motion.div key="select" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-4">
                            <h2 className="text-xl font-semibold border-b border-zinc-800 pb-2">Select Option</h2>
                            <button onClick={() => setViewState('download')} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4 hover:border-red-600/50 transition-all group">
                                <div className="bg-red-600/20 p-3 rounded-full text-red-500 group-hover:bg-red-600 group-hover:text-white transition"><Download size={24}/></div>
                                <div>
                                    <h3 className="text-lg font-bold">Download</h3>
                                    <p className="text-zinc-500 text-xs">Get file in storage</p>
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* 2. QUALITY LIST (From scraped data) */}
                    {viewState === 'download' && (
                        <motion.div key="download" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-3">
                            <h2 className="text-xl font-semibold mb-4">Select Quality</h2>
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

                    {/* 3. VLYXDRIVE (Providers: N-Cloud, G-Drive) */}
                    {viewState === 'vlyxdrive' && (
                        <motion.div key="vlyxdrive" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center">
                            <div className="flex justify-center mb-4"><ShieldCheck className="text-green-400" size={32}/></div>
                            <h2 className="text-2xl font-bold mb-1">VlyxDrive Secure</h2>
                            <p className="text-zinc-400 text-sm mb-6">Checking available servers for <span className="text-white font-bold">{selectedQuality?.label}</span></p>

                            <div className="space-y-3">
                                {loadingProviders ? (
                                    <div className="py-6 flex flex-col items-center"><Loader2 className="animate-spin text-orange-500" size={30}/><p className="text-xs mt-2 text-zinc-500">Decrypting Links...</p></div>
                                ) : providers.length > 0 ? (
                                    providers.map((p, i) => (
                                        <button key={i} onClick={() => handleProviderSelect(p)} className="w-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition group">
                                            <div className="flex items-center gap-3">
                                                <HardDrive className="text-orange-500"/>
                                                <span className="font-bold">{p.name}</span>
                                            </div>
                                            <ChevronRight className="text-zinc-600 group-hover:text-white"/>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-red-400 text-sm bg-red-900/10 p-4 rounded-lg">No Servers Found</div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 4. FINAL LINKS (Result of N-Cloud) */}
                    {viewState === 'final_links' && (
                        <motion.div key="final" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="bg-black border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Server className="text-blue-500"/> {selectedProviderName} Results</h2>
                            
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

                </AnimatePresence>
            </main>
        </div>
    );
              }
                        
