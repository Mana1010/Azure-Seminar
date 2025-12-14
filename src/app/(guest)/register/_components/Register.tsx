"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/environment";
import { Client_UserType } from "@/types/shared.type";

import { Dialog } from "@/components/ui/dialog";
import RegisterSuccessfully from "./RegisterSuccessfully";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { GrTechnology } from "react-icons/gr";
import { toast } from "sonner";

const DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  section: null,
};
function Register() {
  const [data, setData] = useState<Client_UserType>(DEFAULT_VALUES);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const router = useRouter();
  const {
    mutate,
    data: mutationData,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_URL}/api/users/`, data);
      return response.data;
    },
    onSuccess: ({ data }) => {
      setIsOpenDialog(true);
      setData(DEFAULT_VALUES);
      localStorage.setItem("sessionId", data.sessionId);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });
  function handleChange(name: keyof typeof data, val: string) {
    setData((prev) => {
      return {
        ...prev,
        [name]: val,
      };
    });
  }
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId") || null;
    if (sessionId) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full h-full px-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="flex flex-col border border-zinc-500/30 rounded-md backdrop-blur-md bg-white/5 w-full md:w-1/3 p-3 gap-2"
      >
        <div className="flex gap-3">
          <span className="text-3xl text-blue-500">
            <GrTechnology />
          </span>
          <span className={`text-xl font-extrabold text-zinc-300 self-end `}>
            Time In For Attendance
          </span>
        </div>

        <div className="pt-3 grid grid-cols-1 md:grid-cols-2 w-full items-center gap-2">
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            type="text"
            placeholder="Last Name"
            className="border border-zinc-400/35 text-sm placeholder:text-zinc-400 p-2 rounded-md caret-zinc-500 text-zinc-300 col-span-full"
          />
          <input
            required
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="First Name"
            className="border border-zinc-400/35 text-sm placeholder:text-zinc-400 p-2 rounded-md caret-zinc-500 text-zinc-300 col-span-full"
          />

          <Select
            required
            value={data.section || ""}
            onValueChange={(val) => handleChange("section", val)}
          >
            <SelectTrigger className="w-full col-span-2 p-2 border-zinc-400/35 text-zinc-300">
              <SelectValue placeholder="Select your Section" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-0">
              <SelectGroup>
                {["A", "B", "C", "D", "CS"].map((y) => (
                  <SelectItem
                    value={y}
                    key={y}
                    className="text-zinc-400 text-sm hover:bg-zinc-300/10 cursor-pointer"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-0.5 justify-center items-center">
          <p className="text-zinc-400 text-xs py-1">
            You may register only a single time.
          </p>
          <button
            disabled={isPending}
            type="submit"
            className="py-2 w-full rounded-md border border-zinc-400/40 text-zinc-300 bg-[rgb(1,30,73)] relative overflow-hidden cursor-pointer group transition-all duration-150 flex items-center justify-center"
          >
            <span className="absolute -bottom-3 -right-3 text-7xl text-zinc-300/20">
              <GrTechnology />
            </span>
            <span className="relative z-3">
              {" "}
              {isPending ? (
                <div className="flex items-center gap-1.5 justify-center w-full">
                  <Spinner className="text-zinc-400 size-6" />
                  <span className="text-zinc-400">Registering</span>
                </div>
              ) : (
                "Register and Time In"
              )}
            </span>
          </button>
        </div>
      </form>
      <Dialog
        open={isOpenDialog}
        onOpenChange={() => setIsOpenDialog((prev) => !prev)}
      >
        {" "}
        <RegisterSuccessfully
          timeIn={mutationData?.data.timeIn || ""}
          name={mutationData?.data.name || ""}
          setIsOpenDialog={setIsOpenDialog}
        />
      </Dialog>
    </div>
  );
}

export default Register;
