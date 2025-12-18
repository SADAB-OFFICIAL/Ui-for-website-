import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { fetchProxy, decodeBase64 } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const urlParam = searchParams.get("url");

  let hubUrl = "";
  if (key) {
      try {
        const decoded = JSON.parse(decodeBase64(key));
        hubUrl = decoded.url || decoded.link;
      } catch(e) { hubUrl = decodeBase64(key); }
  } else if (urlParam) {
      hubUrl = urlParam;
  } else {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  try {
    const html1 = await fetchProxy(hubUrl);
    if (!html1) throw new Error("HubCloud Failed");
    const $1 = cheerio.load(html1);

    let gamerLink = $1("a#download").attr("href");
    if (!gamerLink) {
        $1("a.btn").each((_, el) => {
            if ($1(el).text().includes("Generate Direct Download Link")) {
                gamerLink = $1(el).attr("href");
            }
        });
    }
    if (!gamerLink) throw new Error("Gamer Link Not Found");

    const html2 = await fetchProxy(gamerLink);
    if (!html2) throw new Error("GamerXYT Failed");
    const $2 = cheerio.load(html2);

    const finalLinks: any[] = [];
    $2("a.btn").each((_, el) => {
        const href = $2(el).attr("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript")) {
            let type = "unknown";
            let name = $2(el).text().trim();
            const text = name.toLowerCase();

            if (text.includes("fslv2")) type = "FSLv2";
            else if (text.includes("fsl")) type = "FSL";
            else if (text.includes("pixel") || href.includes("pixeldrain")) type = "Pixel";
            else if (text.includes("zipdisk")) type = "ZipDisk";

            if(type !== "unknown") finalLinks.push({ name, url: href, type });
        }
    });

    return NextResponse.json({ status: true, servers: finalLinks });

  } catch (error: any) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
