import { NextResponse } from "next/server";
import { canManageCard, deleteSocial, getCurrentSession } from "@/lib/cards";

type Params = {
  params: Promise<{ id: string; socialId: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  const { id, socialId } = await params;
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

  const card = await deleteSocial(id, socialId);
  return NextResponse.json({ card });
}
