import { TIME_OUT, TIME_OUT_AVAILABILITY } from "@/environment";

export function isEventEnded() {
  return new Date().getTime() >= new Date(TIME_OUT as string).getTime();
}

export function isTimeInStop() {
  return (
    new Date().getTime() >= new Date(TIME_OUT_AVAILABILITY as string).getTime()
  );
}
