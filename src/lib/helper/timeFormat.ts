import { format } from "date-fns";
export function time(date: Date) {
  const timeOnly = format(date, "h:mm a");

  return timeOnly;
}
