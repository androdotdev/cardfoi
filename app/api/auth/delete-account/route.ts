import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentSession } from "@/lib/cards";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    // Delete user - Better Auth handles cascade deletion and verification cleanup
    await auth.api.deleteUser({
      headers: request.headers,
      body: {},
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete account error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete account.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
