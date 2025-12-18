import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { fetchProxy, SOURCE_DOMAIN, encodeBase64 } from "@/lib/utils";

const cleanTitle = (raw: string) => raw.split(/HQ|HDTC|Dual Audio|480p|720p|1080p|WEB-DL/i)[0].trim();

export async function GET() {
  try {
    console.log("Fetching Home from:", SOURCE_DOMAIN); // Debugging log

    const html = await fetchProxy(SOURCE_DOMAIN);
    if (!html) throw new Error("Failed to load source");

    const $ = cheerio.load(html);
    const movies: any[] = [];

    // ✅ ZIP FILE SELECTOR LOGIC
    $("article.post").each((_, element) => {
      const rawTitle = $(element).find(".entry-title a").text().trim();
      const poster = $(element).find("figure img").attr("src");
      const link = $(element).find(".entry-title a").attr("href");
      
      if (rawTitle && link && poster) {
        // Link se domain hata kar sirf slug nikalna
        const slugPart = link.replace(SOURCE_DOMAIN, "").replace(/\//g, "");
        
        // Security: Slug aur Domain ko combine karke encrypt karna
        const fullSlug = `${slugPart}|||${SOURCE_DOMAIN}`;
        
        movies.push({ 
            title: cleanTitle(rawTitle), 
            poster, 
            slug: encodeBase64(fullSlug) 
        });
      }
    });

    // Agar movies array empty hai to error throw karo taaki pata chale
    if (movies.length === 0) {
        console.warn("No movies found. Selector might be broken or Proxy blocked.");
    }

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Home API Error:", error);
    return NextResponse.json({ error: "Failed to fetch home" }, { status: 500 });
  }
}
