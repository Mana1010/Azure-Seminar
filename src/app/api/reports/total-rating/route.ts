import { totalRating } from "@/lib/services/app.services";
import { NextResponse } from "next/server";

export async function GET() {
  const { totalFeedback, ratings } = await totalRating();

  return NextResponse.json(
    { data: { totalFeedback, ratings } },
    { status: 200 }
  );
}
