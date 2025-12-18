import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { fetchProxy, decodeBase64 } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const quality = searchParams.get("quality") || "";

  if (!key) return NextResponse.json({ error: "Missing Key" }, { status: 400 });

  try {
    const decoded = JSON.parse(decodeBase64(key));
    const m4uLink = decoded.link;

    const html = await fetchProxy(m4uLink);
    if (!html) throw new Error("Failed");

    const $ = cheerio.load(html);
    let targetDiv: any = null;

    $(".download-links-div h4").each((_, elem) => {
      const text = $(elem).text().trim();
      const searchTerms = decodeURIComponent(quality).split(" ").filter(s => s.length > 2);
      const isMatch = searchTerms.every(term => text.includes(term));
      if (isMatch) targetDiv = $(elem).next(".downloads-btns-div");
    });

    const links: any[] = [];
    if (targetDiv) {
      targetDiv.find("a").each((_: any, el: any) => {
        const href = $(el).attr("href");
        if (href) {
            if (href.includes("hubcloud")) links.push({ name: "N-Cloud", url: href, type: "ncloud" });
            else if (href.includes("gdflix")) links.push({ name: "V-Cloud", url: href, type: "vcloud" });
            else if (href.includes("drive.google")) links.push({ name: "G-Drive", url: href, type: "gdrive" });
        }
      });
    }

    return NextResponse.json({ status: true, data: links });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
