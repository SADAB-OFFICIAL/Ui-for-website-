import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { fetchProxy, SOURCE_DOMAIN, encodeBase64 } from "@/lib/utils";

const cleanTitle = (raw: string) => raw.split(/HQ|HDTC|Dual Audio|480p|720p|1080p|WEB-DL/i)[0].trim();

export async function GET() {
  try {
    const html = await fetchProxy(SOURCE_DOMAIN);
    if (!html) throw new Error("Failed to load source");

    const $ = cheerio.load(html);
    const movies: any[] = [];

    $("article.post").each((_, element) => {
      const rawTitle = $(element).find(".entry-title a").text().trim();
      const poster = $(element).find("figure img").attr("src");
      const link = $(element).find(".entry-title a").attr("href");
      
      if (rawTitle && link && poster) {
        const slugPart = link.replace(SOURCE_DOMAIN, "").replace(/\//g, "");
        const fullSlug = `${slugPart}|||${SOURCE_DOMAIN}`;
        
        movies.push({ 
            title: cleanTitle(rawTitle), 
            poster, 
            slug: encodeBase64(fullSlug)
        });
      }
    });

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch home" }, { status: 500 });
  }
}
