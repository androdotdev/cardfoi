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

  // 3. Forward Range header to Cloudinary (it supports range requests natively)
  const range = request.headers.get("range");
  const fetchHeaders: HeadersInit = {};
  if (range) {
    fetchHeaders["Range"] = range;
  }

  const cloudinaryResponse = await fetch(signedUrl, { headers: fetchHeaders });

  if (!cloudinaryResponse.ok && cloudinaryResponse.status !== 206) {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 502 },
    );
  }

  // 4. Stream response headers
  const responseHeaders = new Headers({
    "Content-Type":
      cloudinaryResponse.headers.get("content-type") || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  });

  const contentLength = cloudinaryResponse.headers.get("content-length");
  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  const contentRange = cloudinaryResponse.headers.get("content-range");
  if (contentRange) {
    responseHeaders.set("Content-Range", contentRange);
  }

  // 5. Stream the response body directly — no buffering
  return new NextResponse(cloudinaryResponse.body, {
    status: cloudinaryResponse.status,
    headers: responseHeaders,
  });
}
