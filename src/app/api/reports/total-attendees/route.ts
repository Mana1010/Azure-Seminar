import { totalAttendees } from "@/lib/services/app.services";
import { NextResponse } from "next/server";

export async function GET() {
  const list = await totalAttendees();

  return NextResponse.json({ data: list }, { status: 200 });
}
