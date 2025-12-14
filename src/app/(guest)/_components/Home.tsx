"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import azure from "../../../../public/azure.png";

import Snow from "@/components/Snow";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LoginAsAdmin from "./LoginAsAdmin";
import { GrTechnology } from "react-icons/gr";
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { API_URL, TIME_OUT } from "@/environment";
import SubmitFeedback from "./SubmitFeedback";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { isEventEnded, isTimeInStop } from "@/lib/utils/checkEvent";

export default function Home() {
  const [dateTimeOut, setDateTimeOut] = useState("00: 00: 00");
  const router = useRouter();
  const [isEnded, setIsEnded] = useState(false);
  const [isOpenFeedbackDialog, setIsOpenFeedbackDialog] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // const [isEventStarted, setIsEventStarted] = useState(false);
  const { mutate: timeOutMutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.patch(`${API_URL}/api/users`, null, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setIsOpenFeedbackDialog(true);
      setSessionId(null);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 401) {
        setSessionId(null);
        localStorage.removeItem("sessionId");
      }
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });

  useEffect(() => {
    const session = localStorage.getItem("sessionId") || null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(session);
  }, []);
  useEffect(() => {
    const timeout = new Date(TIME_OUT || new Date());
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = differenceInSeconds(timeout, now) % 60;
      const hours = differenceInHours(timeout, now);
      const minutes = differenceInMinutes(timeout, now) % 60;
      if (new Date().getTime() >= timeout.getTime()) {
        clearInterval(interval);
        setIsEnded(true);
        return;
      }
      setDateTimeOut(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}: ${String(seconds).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center h-full w-full `}>
      <div className="flex flex-col items-center gap-2 justify-center w-full h-full px-4">
        <div className="flex flex-col items-center pb-3">
          <Image width={100} height={100} alt="azure" src={azure} />
          <h6
            className={`text-zinc-300 text-center text-2xl md:text-3xl font-extrabold `}
          >
            Microsoft Development Tools &{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[rgb(0,155,211)] to-[rgb(1,125,174)]">
              Azure
            </span>{" "}
            Serverless Seminar
          </h6>
        </div>

        {!isEventEnded() && !sessionId && !isTimeInStop() && (
          <button
            onClick={() => router.push("/register")}
            className="py-2 w-full sm:w-1/2 md:w-1/4 rounded-md border border-zinc-400/40 text-zinc-300 bg-[rgb(1,30,73)] relative overflow-hidden cursor-pointer group transition-all duration-150 flex items-center justify-center"
          >
            <span className="absolute -bottom-3 -right-3 text-7xl text-zinc-300/20">
              <GrTechnology />
            </span>
            <span className="relative z-3 text-md font-bold">Time In</span>
          </button>
        )}

        {sessionId && (
          <button
            onClick={() => timeOutMutate()}
            disabled={!isEnded || isPending}
            className="py-2 w-full sm:w-1/2 md:w-1/4 rounded-md border border-zinc-400/40 disabled:bg-zinc-400/35 disabled:cursor-not-allowed text-zinc-300 bg-[rgb(1,30,73)] relative overflow-hidden cursor-pointer group transition-all duration-150 flex items-center justify-center"
          >
            <span className="absolute -bottom-3 -right-3 text-7xl text-zinc-300/20">
              <GrTechnology />
            </span>
            <span className="relative z-3 text-md font-bold">
              Time out {!isEnded && <span>({dateTimeOut})</span>}
            </span>
          </button>
        )}

        <Dialog>
          <DialogTrigger className="py-2 w-full sm:w-1/2 md:w-1/4 rounded-md border border-zinc-400/40 text-zinc-300 bg-secondary relative overflow-hidden cursor-pointer group transition-all duration-150 flex items-center justify-center">
            <span className="relative z-3 text-md font-bold">
              Login as Admin
            </span>
          </DialogTrigger>
          <LoginAsAdmin />
        </Dialog>
      </div>

      <Dialog
        open={isOpenFeedbackDialog}
        onOpenChange={() => setIsOpenFeedbackDialog((prev) => !prev)}
      >
        <SubmitFeedback setIsOpenFeedbackDialog={setIsOpenFeedbackDialog} />
      </Dialog>
    </div>
  );
}
