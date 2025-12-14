import { feedbackList, sendFeedback } from "@/lib/services/app.services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const sessionId = req.headers.get("authorization")?.split(" ")[1];
  const isUserRegister = await sendFeedback(data, sessionId || "");

  if (!isUserRegister) {
    return NextResponse.json(
      { message: "You haven't register yet" },
      { status: 401 }
    );
  }
  return NextResponse.json(
    { message: "Feedback submitted successfully" },
    { status: 201 }
  );
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const cursor = search.get("cursor") || "null";
  const list = await feedbackList(cursor);
  return NextResponse.json({ data: list }, { status: 200 });
}
