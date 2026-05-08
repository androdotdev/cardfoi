import { NextResponse } from "next/server";
import { canManageCard, getCard, getCurrentSession, updateCard } from "@/lib/cards";
import { isAdmin } from "@/lib/cards";
import { cardPayload } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  return NextResponse.json({ card });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
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

  const body = await request.json();
  const payload = cardPayload(body);

  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  // Handle slug update separately
  const newSlug = body.newSlug ? String(body.newSlug).trim() : undefined;
  const userIsAdmin = await isAdmin(session.user.id);

  try {
    const card = await updateCard(id, {
      ...payload.data,
      newSlug,
      isAdmin: userIsAdmin
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    return NextResponse.json({ card });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update card.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
