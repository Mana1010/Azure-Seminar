type Section = "A" | "B" | "C" | "D" | "CS";

export type SortLastName = "asc" | "desc" | "default";
export type Server_UserType = {
  firstName: string;
  lastName: string;
  section: Section;
};

export type Client_UserType = {
  firstName: string;
  lastName: string;
  section: Section | null;
};

export type AdminAccountType = {
  username: string;
  password: string;
  secretKey: string;
};

export type AttendeesType = {
  timeIn: Date;
  timeOut: Date | null;
  section: Section;
  firstName: string;
  lastName: string;

  id: string;
  status: "Present" | "Away";
};

export type FeedbackType = {
  author: { lastName: string; firstName: string };
  rating: number;
  comment: string | null;
  createdAt: Date;
  id: string;
};

export type TotalAttendanceType = {
  name: Section;
  attendees: number;
  fill: string;
};
