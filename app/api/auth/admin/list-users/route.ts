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
  const query: Record<string, any> = {};

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
  } catch (error: any) {
    console.error("List users error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to list users." },
      { status: 500 }
    );
  }
}
