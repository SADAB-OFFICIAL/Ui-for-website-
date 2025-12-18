import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { fetchProxy, decodeBase64, encodeBase64 } from "@/lib/utils";

const cleanTitle = (raw: string) => raw.split(/HQ|HDTC|Dual Audio|480p|720p|1080p|WEB-DL/i)[0].trim();
const generateVlyxKey = (link: string) => encodeBase64(JSON.stringify({ link }));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  
  if (!slug) return NextResponse.json({ error: "Missing Slug" }, { status: 400 });

  let targetUrl = "";
  try {
      const decoded = decodeBase64(slug);
      const [path, baseUrl] = decoded.split("|||");
      targetUrl = `${baseUrl}/${path}/`;
  } catch (e) { 
      return NextResponse.json({ error: "Invalid Slug" }, { status: 400 }); 
  }

  try {
    const html = await fetchProxy(targetUrl);
    if (!html) throw new Error("Source Down");

    const $ = cheerio.load(html);
    const rawTitle = $("h1").first().text().trim();
    const title = cleanTitle(rawTitle);
    const poster = $(".post-thumbnail img").attr("src");
    const description = $("h3:contains('Storyline')").next("p").text().trim();

    const episodeLinks: any[] = [];
    const batchLinks: any[] = [];

    $(".download-links-div h4").each((_, elem) => {
      const label = $(elem).text().trim();
      const linkDiv = $(elem).next(".downloads-btns-div");
      const resMatch = label.match(/(\d{3,4}p)/);
      const res = resMatch ? resMatch[0] : "HD";
      const isHEVC = label.toLowerCase().includes("hevc");
      
      const normalBtn = linkDiv.find("a.btn:not(.btn-zip)").attr("href");
      if (normalBtn) {
         const sizeMatch = label.match(/\[(\d+(\.\d+)?[GM]B)(\/E)?\]/);
         episodeLinks.push({ 
             label, res, isHEVC, 
             size: sizeMatch ? sizeMatch[1] : "N/A", 
             url: normalBtn, 
             vlyx_key: generateVlyxKey(normalBtn) 
         });
      }
    });

    return NextResponse.json({ status: true, data: { title, poster, description, episodeLinks, batchLinks } });

  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
