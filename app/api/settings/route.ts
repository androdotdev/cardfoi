import { NextResponse } from "next/server";
import { canManageCard, getCurrentSession, updateSettings } from "@/lib/cards";

export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id ?? "").trim();

  if (!id) {
    return NextResponse.json({ error: "Card id is required." }, { status: 400 });
  }

  const access = await canManageCard(id, session.user.id);
  if (!access.card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }
  if (!access.allowed) {
    return NextResponse.json({ error: "You do not have permission to edit this card." }, { status: 403 });
  }

  const card = await updateSettings(id, {
    name: String(body.name ?? "").trim(),
    avatar: String(body.avatar ?? "").trim()
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  return NextResponse.json({ card });
}
