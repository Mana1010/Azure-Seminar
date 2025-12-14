"use client";

import { ReactNode } from "react";

import { IoChatboxEllipses, IoGrid, IoList } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/environment";
import { toast } from "sonner";
import { GrTechnology } from "react-icons/gr";
type AdminProviderProps = {
  children: ReactNode;
};
const menus = [
  {
    name: "Dashboard",
    icon: IoGrid,
    path: "/admin/dashboard",
  },
  {
    name: "Attendance",
    icon: IoList,
    path: "/admin/attendance",
  },

  {
    name: "Feedback",
    icon: IoChatboxEllipses,
    path: "/admin/feedback",
  },
];
function AdminProvider({ children }: AdminProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${API_URL}/api/auth/logout`);
      return res.data.message;
    },
    onSuccess: (message) => {
      toast.success(message);
      router.push("/");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });
  return (
    <div className="w-full h-full flex items-center justify-center p-7">
      <div className="flex items-center w-full h-full rounded-md backdrop-blur-md bg-white/5 p-5 gap-3">
        <aside className=" bg- h-full basis-[20%] shrink-0 flex p-2.5 flex-col relative overflow-hidden rounded-md">
          <header className="flex items-center gap-3">
            <h3 className={` text-xl text-zinc-300`}>Menus</h3>
          </header>
          <div className="flex flex-col justify-between w-full grow">
            <nav className="flex flex-col py-4 gap-1">
              {menus.map((m) => (
                <button
                  onClick={() => {
                    router.push(m.path);
                  }}
                  key={m.name}
                  className={`p-2 flex items-center justify-between gap-1.5 rounded-sm text-zinc-200 text-sm font-bold overflow-hidden border border-transparent
       
                  hover:bg-zinc-900 hover:border-zinc-400/15 ${
                    pathname === m.path && "bg-zinc-900 border-zinc-400/15"
                  } cursor-pointer hover:backdrop-blur-md relative group`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-md text-zinc-400">
                      <m.icon />
                    </span>
                    <span
                      className={`group-hover:text-primary  ${
                        pathname === m.path && "text-primary"
                      }`}
                    >
                      {m.name}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
            <button
              onClick={() => mutate()}
              className="py-2 w-full text-xs rounded-md border border-zinc-400/40 text-zinc-300 bg-[rgb(1,30,73)] relative overflow-hidden cursor-pointer group transition-all duration-150 flex items-center justify-center"
            >
              <span className="absolute -bottom-1 -right-1 text-4xl text-zinc-300/20">
                <GrTechnology />
              </span>
              <span className="relative z-3 font-bold">Logout</span>
            </button>
          </div>
        </aside>
        <div className="h-full grow p-3 rounded-md bg-zinc-900">{children}</div>
      </div>
    </div>
  );
}

export default AdminProvider;
