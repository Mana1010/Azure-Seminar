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
  timeIn: string;
  timeOut: string | null;
  section: Section;
  firstName: string;
  lastName: string;

  id: string;
  status: "Present" | "Away";
  totalTime: string | null;
};

export type ConfessionType = {
  id: string;
  comment: string;
  isRead: boolean;
  createdAt: string;
};

export type FeedbackType = {
  author: { lastName: string; firstName: string };
  rating: number;
  comment: string | null;
  createdAt: string;
  id: string;
};

export type TotalAttendanceType = {
  name: Section;
  attendees: number;
  fill: string;
};
