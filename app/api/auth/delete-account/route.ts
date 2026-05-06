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
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to delete account." },
      { status: 500 }
    );
  }
}
