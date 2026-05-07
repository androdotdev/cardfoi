import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { works } from "@/db/schema";
import { eq } from "drizzle-orm";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workId: string }> }
) {
  const { workId } = await params;

  // 1. Fetch work from DB
  const [work] = await db
    .select({
      cloudinaryPublicId: works.cloudinaryPublicId,
      type: works.type,
    })
    .from(works)
    .where(eq(works.id, workId))
    .limit(1);

  if (!work || !work.cloudinaryPublicId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 2. Generate signed URL (1 hour expiry)
  const signedUrl = cloudinary.url(work.cloudinaryPublicId, {
    resource_type: work.type === "video" ? "video" : "image",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  // 3. Fetch from Cloudinary
  const cloudinaryResponse = await fetch(signedUrl);

  if (!cloudinaryResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 502 }
    );
  }

  // 4. Handle Range requests for video seeking
  const range = request.headers.get("range");
  const contentLength = cloudinaryResponse.headers.get("content-length");
  const contentType = cloudinaryResponse.headers.get("content-type") || "application/octet-stream";

  const headers = new Headers({
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  });

  if (range && contentLength) {
    // Parse Range header (e.g., "bytes=0-1023")
    const rangeMatch = range.match(/bytes=(\d+)-(\d*)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = rangeMatch[2]
        ? parseInt(rangeMatch[2])
        : parseInt(contentLength) - 1;
      const chunkSize = end - start + 1;

      // Fetch full content and slice (Cloudinary doesn't support range requests directly)
      const buffer = await cloudinaryResponse.arrayBuffer();
      const slice = buffer.slice(start, end + 1);

      headers.set("Content-Range", `bytes ${start}-${end}/${contentLength}`);
      headers.set("Content-Length", chunkSize.toString());

      return new NextResponse(slice, { status: 206, headers });
    }
  }

  // 5. Return full content
  const buffer = await cloudinaryResponse.arrayBuffer();
  headers.set("Content-Length", buffer.byteLength.toString());

  return new NextResponse(buffer, { headers });
}
