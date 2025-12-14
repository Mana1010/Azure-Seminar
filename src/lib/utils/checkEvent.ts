import { TIME_OUT } from "@/environment";

export function isEventEnded() {
  return new Date().getTime() >= new Date(TIME_OUT as string).getTime();
}
