import { NextResponse } from "next/server";
import { canManageCard, deleteWork, getCurrentSession, getWork } from "@/lib/cards";
import cloudinary from "@/lib/cloudinary";

type Params = {
  params: Promise<{ id: string; workId: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  const { id, workId } = await params;
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const access = await canManageCard(id, session.user.id);
  if (!access.card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }
  if (!access.allowed) {
    return NextResponse.json({ error: "You do not have permission to edit this card." }, { status: 403 });
  }

  const work = await getWork(id, workId);
  if (work?.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(work.cloudinaryPublicId, {
      resource_type: work.type === "video" ? "video" : "image"
    });
  }

  const card = await deleteWork(id, workId);

  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  return NextResponse.json({ card });
}
