import { topTenAttendees } from "@/lib/services/app.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const data = await topTenAttendees(search.get("sort") as "asc" | "desc");
  return NextResponse.json({ data }, { status: 200 });
}
