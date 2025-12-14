import {
  ADMIN_PASSWORD,
  ADMIN_SECRET_KEY,
  ADMIN_SESSION_KEY,
  ADMIN_USERNAME,
} from "@/environment";
import { AdminAccountType } from "@/types/shared.type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as AdminAccountType;

  const isAllCredentialsCorrect =
    data.username === ADMIN_USERNAME &&
    data.password === ADMIN_PASSWORD &&
    data.secretKey === ADMIN_SECRET_KEY;
  if (!isAllCredentialsCorrect) {
    return NextResponse.json(
      {
        message: "Unable to authenticate with the provided details.",
      },
      { status: 401 }
    );
  }

  const res = NextResponse.json(
    {
      message: "Access granted",
    },
    { status: 200 }
  );
  res.cookies.set({
    name: "adminKey",
    value: ADMIN_SESSION_KEY || "",
    httpOnly: true,
    path: "/",
  });
  return res;
}
