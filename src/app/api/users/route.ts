import { Section } from "@/generated/prisma/enums";
import { time } from "@/lib/helper/timeFormat";
import { attendanceList, registerUser } from "@/lib/services/app.services";
import { isEventEnded } from "@/lib/utils/checkEvent";
import { NextRequest, NextResponse } from "next/server";
import { isUserRegister, timeout } from "@/lib/services/app.services";
import { SortLastName } from "@/types/shared.type";
export async function POST(req: NextRequest) {
  try {
    const isEnded = isEventEnded();
    if (isEnded) {
      return NextResponse.json(
        { message: "The event is already ended." },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log(body);
    const { sessionId, timeIn, firstName } = await registerUser(body);

    return NextResponse.json(
      {
        data: {
          timeIn: time(timeIn || new Date()),
          name: firstName,
          sessionId,
        },
        isSuccess: true,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const queries: {
    cursor: string;

    filterSection: Section | "ALL";
    search: string;
    sort: SortLastName;
  } = {
    cursor: search.get("cursor") || "null",
    filterSection: (search.get("filterSection") as Section | "ALL") || "ALL",
    search: search.get("search") || "",
    sort: (search.get("sort") || "default") as SortLastName,
  };
  try {
    const attendees = await attendanceList(queries);
    return NextResponse.json({ data: attendees });
  } catch (err) {
    if (err instanceof Error) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ message }, { status: 500 });
    }
  }
}

//Time out
export async function PATCH(req: NextRequest) {
  const sessionId = req.headers.get("authorization")?.split(" ")[1];
  if (!sessionId) {
    return NextResponse.json(
      { message: "Session Id is required" },
      { status: 400 }
    );
  }

  if (!isEventEnded()) {
    return NextResponse.json(
      { message: "Event has not ended yet, so sit back, relax and enjoy." },
      { status: 400 }
    );
  }
  if (!(await isUserRegister(sessionId))) {
    return NextResponse.json(
      { message: "You have not registered yet." },
      { status: 401 }
    );
  }

  const isTimeOut = await timeout(sessionId);
  if (isTimeOut) {
    return NextResponse.json(
      { message: "User already time out" },
      { status: 400 }
    );
  }
  return NextResponse.json({}, { status: 202 });
}
