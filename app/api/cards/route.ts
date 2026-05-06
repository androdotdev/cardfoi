import { NextResponse } from "next/server";
import { createCard, getCurrentSession, getThemes, isAdmin, listCards } from "@/lib/cards";
import { cardPayload } from "@/lib/validation";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ cards: [], themes: getThemes(), session: null });
  }

  const cards = await listCards(session.user.id);
  return NextResponse.json({ cards, themes: getThemes(), session });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = await request.json();
  const payload = cardPayload(body);

  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  return NextResponse.json({ card: await createCard(session.user.id, payload.data) }, { status: 201 });
}
