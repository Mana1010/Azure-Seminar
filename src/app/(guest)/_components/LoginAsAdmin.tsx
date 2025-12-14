import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/environment";
import { useRouter } from "next/navigation";
import { GrTechnology } from "react-icons/gr";
function LoginAsAdmin() {
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
    secretKey: "",
  });
  function handleChange(name: keyof typeof data, val: string) {
    setData((prev) => {
      return {
        ...prev,
        [name]: val,
      };
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_URL}/api/auth/login`, data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      router.push("/admin/dashboard");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });

  return (
    <DialogContent className="border [&>button]:text-zinc-300/70 justify-between border-zinc-400/25 flex flex-col items-center bg-zinc-800 overflow-hidden w-full">
      <DialogHeader className="justify-start w-full flex">
        <DialogTitle className="flex gap-3">
          <span className="text-3xl text-blue-500">
            <GrTechnology />
          </span>
          <span className={`text-xl font-extrabold text-zinc-300 self-end`}>
            Login as Admin
          </span>
        </DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="flex flex-col rounded-md w-full gap-2 grow"
      >
        <div className="pt-3 flex flex-col w-full items-center gap-2">
          <input
            required
            name="username"
            value={data.username}
            onChange={(e) => handleChange("username", e.target.value)}
            type="text"
            placeholder="Username"
            className="border border-zinc-400/35 text-sm placeholder:text-zinc-400 p-2 rounded-md caret-zinc-500 text-zinc-300 w-full"
          />
          <input
            required
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Password"
            className="border border-zinc-400/35 text-sm placeholder:text-zinc-400 p-2 rounded-md caret-zinc-500 text-zinc-300 w-full"
          />
          <div className="w-full items-center flex flex-col gap-1">
            <h6 className="text-zinc-400 text-xs font-bold">Admin Key</h6>
            <InputOTP
              onChange={(e) => handleChange("secretKey", e)}
              required
              maxLength={6}
              className="justify-self-center"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="border border-zinc-400/35 text-zinc-400"
                />
                <InputOTPSlot
                  index={1}
                  className="border border-zinc-400/35 text-zinc-400"
                />
                <InputOTPSlot
                  index={2}
                  className="border border-zinc-400/35 text-zinc-400"
                />
              </InputOTPGroup>
              <InputOTPSeparator className=" text-zinc-400" />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="border border-zinc-400/35 text-zinc-400"
                />
                <InputOTPSlot
                  index={4}
                  className="border border-zinc-400/35 text-zinc-400"
                />
                <InputOTPSlot
                  index={5}
                  className="border border-zinc-400/35 text-zinc-400"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="py-2 w-full rounded-md border border-zinc-400/40 text-zinc-300 bg-secondary relative overflow-hidden cursor-pointer group transition-all duration-150 flex items-center justify-center mt-2"
        >
          <span className="relative z-3">
            {" "}
            {isPending ? (
              <div className="flex items-center gap-1.5 justify-center w-full">
                <Spinner className="text-zinc-400 size-6" />
                <span className="text-zinc-400">Registering</span>
              </div>
            ) : (
              "Login"
            )}
          </span>
        </button>
      </form>
    </DialogContent>
  );
}

export default LoginAsAdmin;
