import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentSession, isAdmin } from "@/lib/cards";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const isUserAdmin = await isAdmin(session.user.id);
  if (!isUserAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  // Prevent admin from deleting themselves via this endpoint
  if (userId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account via admin endpoint. Use the Security tile instead." },
      { status: 400 }
    );
  }

  try {
    await auth.api.removeUser({
      body: { userId },
      headers: request.headers,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to delete user." },
      { status: 500 }
    );
  }
}
