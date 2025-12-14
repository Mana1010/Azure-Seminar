import { deleteUser, timeout } from "@/lib/services/app.services";
import { isEventEnded } from "@/lib/utils/checkEvent";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;
  if (!userId) {
    return NextResponse.json(
      { message: "User Id is required" },
      { status: 400 }
    );
  }
  await deleteUser(userId);
  return NextResponse.json(
    { message: "User already deleted" },
    { status: 200 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;
  if (!userId) {
    return NextResponse.json(
      { message: "Session Id is required" },
      { status: 400 }
    );
  }
  if (!isEventEnded()) {
    return NextResponse.json(
      { message: "Event has not ended yet." },
      { status: 400 }
    );
  }
  const isUserTimeout = await timeout(userId);
  if (isUserTimeout) {
    return NextResponse.json(
      { message: "User already time out" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { message: "User successfully time out" },
    { status: 200 }
  );
}
