import { Server_UserType, SortLastName } from "@/types/shared.type";
import { prisma } from "../prisma";
import { Section } from "@/generated/prisma/enums";
import { differenceInHours, differenceInMinutes, format } from "date-fns";

export const isUserRegister = async (sessionId: string | undefined) => {
  let isRegister = true;
  if (!sessionId) {
    isRegister = false;
  }
  const user = await prisma.user.findUnique({
    where: {
      sessionId,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    isRegister = false;
  }
  return isRegister;
};

export const registerUser = async (data: Server_UserType) => {
  console.log(data);
  const result = await prisma.user.create({
    data: {
      ...data,
    },
    select: {
      timeIn: true,
      sessionId: true,
      firstName: true,
    },
  });
  return {
    timeIn: result.timeIn,
    sessionId: result.sessionId,
    firstName: result.firstName,
  };
};

type AttendanceListParams = {
  cursor: string;

  filterSection: Section | "ALL";
  sort: SortLastName;
  search: string;
};

const section = ["A", "B", "C", "D", "CS"];
export const attendanceList = async (params: AttendanceListParams) => {
  const { cursor, filterSection, search, sort } = params;

  const users = await prisma.user.findMany({
    where: {
      ...(filterSection &&
        filterSection !== "ALL" &&
        section.includes(filterSection) && {
          section: filterSection,
        }),

      ...(search &&
        search.length > 0 && {
          OR: [
            { lastName: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
          ],
        }),
    },
    orderBy: [
      {
        ...(["asc", "desc"].includes(sort) && {
          lastName: sort as "desc" | "asc",
        }),
      },
      { timeIn: "desc" },
    ],

    take: 20,
    ...(cursor &&
      cursor !== "null" && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
    select: {
      timeIn: true,
      timeOut: true,
      section: true,
      lastName: true,
      firstName: true,
      id: true,
    },
  });

  const formattedResult = users.map((u) => {
    return {
      ...u,
      status: u.timeOut ? "Away" : "Present",
    };
  });

  return formattedResult;
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export async function timeout(id: string) {
  let isUserTimeout = false;
  const isTimeOut = await prisma.user.findFirst({
    where: {
      OR: [{ sessionId: id }, { id }],
    },
    select: {
      timeOut: true,
      id: true,
    },
  });
  if (isTimeOut?.timeOut) {
    isUserTimeout = true;
    return isUserTimeout;
  }
  if (isTimeOut?.id) {
    await prisma.user.update({
      where: {
        id: isTimeOut.id,
      },
      data: {
        timeOut: new Date(),
      },
    });
  }

  return isUserTimeout;
}

export async function sendFeedback(
  data: { rating: number; comment: string },
  sessionId: string
) {
  let isUserRegister = true;
  const user = await prisma.user.findUnique({
    where: {
      sessionId,
    },
    select: {
      id: true,
    },
  });
  if (!user?.id) {
    isUserRegister = false;
    return isUserRegister;
  }

  await prisma.feedback.create({
    data: {
      rating: data.rating,
      comment: data.comment ? data.comment : null,
      authorId: user?.id,
    },
  });
  return isUserRegister;
}

export async function feedbackList(cursor: string) {
  const list = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    ...(cursor &&
      cursor !== "null" && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
    select: {
      author: {
        select: {
          lastName: true,
          firstName: true,
        },
      },
      rating: true,
      comment: true,
      createdAt: true,
      id: true,
    },
  });

  return list;
}

export async function totalAttendees() {
  const groupedAttendees = await prisma.user.groupBy({
    by: ["section"],
    _count: { _all: true },
  });
  const fills = {
    A: "#B3E5FC",
    B: "#4FC3F7",
    C: "#03A9F4",
    D: "#0288D1",
    CS: "#01579B",
  };

  const formattedAttendees = groupedAttendees.map(({ _count, section }) => {
    return {
      name: section,
      attendees: _count._all,
      fill: fills[section],
    };
  });
  return formattedAttendees;
}

export async function topTenAttendees(sort: "asc" | "desc") {
  const list = await prisma.user.findMany({
    ...(["asc", "desc"].includes(sort) && {
      orderBy: {
        timeIn: sort,
      },
      take: 10,
    }),
    select: {
      section: true,
      lastName: true,
      firstName: true,
      timeIn: true,
    },
  });

  const formattedResult = list.map(
    ({ firstName, lastName, section, timeIn }) => {
      return {
        name: `${firstName} ${lastName}`,
        year: `${section}`,
        timeIn,
      };
    }
  );
  return formattedResult;
}

export async function totalRating() {
  const fill = {
    fiveStar: "#FACC15",
    fourStar: "#FDE047",
    threeStar: "#FEF08A",
    twoStar: "#FEF9C3",
    oneStar: "#FFFBEB",
  };

  const [ratings, totalFeedback] = await prisma.$transaction([
    prisma.feedback.groupBy({
      by: ["rating"],
      _sum: { rating: true },
      orderBy: undefined,
    }),
    prisma.feedback.count(),
  ]);

  const result = [] as {
    rating: number;
    name: string;
    fill: string;
  }[];
  const ratingKeys = [
    "oneStar",
    "twoStar",
    "threeStar",
    "fourStar",
    "fiveStar",
  ];

  Array.from({ length: 5 }).forEach((_, i) => {
    const rating = i + 1;
    const ratingObj = ratings.find((l) => l.rating === rating);
    const key = ratingKeys[i]; // or rating - 1
    if (ratingObj) {
      result.push({
        rating: ratingObj?._sum?.rating || 0,
        name: key,
        fill: fill[key as keyof typeof fill], // correct key now
      });
      return;
    }
    result.push({
      rating: 0,
      name: key,
      fill: fill[key as keyof typeof fill],
    });
  });

  return { ratings: result, totalFeedback };
}
