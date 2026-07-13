import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentSession, isAdmin } from "@/lib/cards";

export async function GET(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const isUserAdmin = await isAdmin(session.user.id);
  if (!isUserAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query: Record<string, string | number> = {};

  const searchValue = searchParams.get("search");
  if (searchValue) {
    query.searchValue = searchValue;
    query.searchField = "email";
    query.searchOperator = "contains";
  }

  const limit = searchParams.get("limit");
  if (limit) query.limit = parseInt(limit);

  const offset = searchParams.get("offset");
  if (offset) query.offset = parseInt(offset);

  try {
    const result = await auth.api.listUsers({
      headers: request.headers,
      query,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("List users error:", error);
    const message = error instanceof Error ? error.message : "Failed to list users.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
