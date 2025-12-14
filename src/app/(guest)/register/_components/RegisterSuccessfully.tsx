import { DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

import azure from "../../../../../public/azure.png";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { GrTechnology } from "react-icons/gr";
import { time } from "@/lib/helper/timeFormat";

type RegisterSuccessfullyProps = {
  timeIn: Date;
  name: string;
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
};
function RegisterSuccessfully({
  timeIn,
  name,
  setIsOpenDialog,
}: RegisterSuccessfullyProps) {
  const router = useRouter();
  return (
    <DialogContent
      onInteractOutside={(e) => e.preventDefault()}
      showCloseButton={false}
      className="border justify-between border-zinc-400/25 min-h-1/2 flex flex-col items-center bg-zinc-900 overflow-hidden"
    >
      <div className="flex grow items-center w-full justify-center relative">
        <div className={`flex items-center gap-2 flex-col`}>
          <Image src={azure} width={70} height={70} priority alt="azure" />
          <h5 className={`text-white text-xl`}>
            Thank you for Attending,{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[rgb(0,155,211)] to-[rgb(1,125,174)]">
              {name}
            </span>
          </h5>
          <p className="text-zinc-300 text-xs text-center">
            Your attendance for the seminar has been successfully recorded at{" "}
            <span className="text-primary font-bold">{time(timeIn)}</span>. The
            official time-out will be at 11:00 AM.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-0.5">
        <p className="text-zinc-400 text-xs py-1">
          Please take a screenshot as proof in case any issues arise.
        </p>

        <button
          onClick={() => {
            setIsOpenDialog((prev) => !prev);
            router.push("/");
          }}
          className="py-2 w-full rounded-md border border-zinc-400/40 text-zinc-300 bg-[rgb(1,30,73)] relative overflow-hidden cursor-pointer group transition-all duration-150"
        >
          <span className="absolute -bottom-3 -right-3 text-7xl text-zinc-300/20">
            <GrTechnology />
          </span>
          <span className="relative z-3">Okay, I understand.</span>
        </button>
      </div>
    </DialogContent>
  );
}

export default RegisterSuccessfully;
