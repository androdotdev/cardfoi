import { NextResponse } from "next/server";
import { addWork, canManageCard, getCurrentSession } from "@/lib/cards";
import { workPayload } from "@/lib/validation";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
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
  const payload = workPayload(body);

  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  const card = await addWork(id, payload.data);
  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  return NextResponse.json({ card }, { status: 201 });
}
