import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ EXACT PROXY FROM ZIP
export const PROXY_BASE = "https://proxy2.vlyx.workers.dev/?url=";
export const SOURCE_DOMAIN = "https://movies4u.nexus";

// Base64 Helpers (Zaroori hai slug generation ke liye)
export const encodeBase64 = (str: string) => {
  if (typeof window === "undefined") return Buffer.from(str).toString("base64");
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
};

export const decodeBase64 = (str: string) => {
  if (typeof window === "undefined") return Buffer.from(str, "base64").toString("utf-8");
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
};

// 🔥 ROBUST FETCH PROXY (Handles JSON Response from Proxy 2)
export const fetchProxy = async (url: string) => {
  try {
    // URL encode nahi kar rahe kyunki proxy shayad raw URL expect kar raha hai (Zip logic)
    const res = await fetch(`${PROXY_BASE}${url}`, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!res.ok) throw new Error(`Proxy Error: ${res.status}`);

    const contentType = res.headers.get("content-type");
    
    // ✅ CRITICAL FIX: Agar Proxy JSON return kar raha hai to HTML extract karo
    if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        return json.html || ""; 
    }
    
    // Agar text hai to direct return karo
    return await res.text();

  } catch (error) {
    console.error("Scraping Failed:", error);
    return null;
  }
};
