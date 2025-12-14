import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { message: "Successfully logged out" },
    { status: 200 }
  );
  res.cookies.delete("adminKey");
  return res;
}
