import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VoltBot/1.0)",
      },
    });
    clearTimeout(timeout);

    const html = await response.text();

    const title = extractMeta(html, "og:title") || extractTagContent(html, "title");
    const image = extractMeta(html, "og:image");
    const description = extractMeta(html, "og:description") || extractMeta(html, "description");

    return NextResponse.json({ title: title || null, image: image || null, description: description || null });
  } catch {
    return NextResponse.json({ title: null, image: null, description: null });
  }
}

function extractMeta(html: string, property: string): string | null {
  // Try property="..." (OG tags)
  const ogMatch = html.match(
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")
  );
  if (ogMatch) return ogMatch[1];

  // Try content before property
  const reverseMatch = html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i")
  );
  if (reverseMatch) return reverseMatch[1];

  return null;
}

function extractTagContent(html: string, tag: string): string | null {
  const match = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i"));
  return match ? match[1].trim() : null;
}
