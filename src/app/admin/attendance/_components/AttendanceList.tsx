"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { API_URL } from "@/environment";

import useDebounce from "@/hooks/useDebounce";
import { AttendeesType } from "@/types/shared.type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  IoFilter,
  IoSearch,
  IoTime,
  IoTimeOutline,
  IoTrashBin,
} from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

const section = ["ALL", "A", "B", "C", "D", "CS"];
const columns = [
  "Last Name",
  "First Name",
  "Section",
  "Status",
  "Time In",
  "Time Out",
  "Total Time",
  "Actions",
];

const SORT_SELECTION = [
  {
    name: "Default",
    code: "default",
  },
  {
    name: "A-Z",
    code: "asc",
  },
  {
    name: "Z-A",
    code: "desc",
  },
];
function AttendanceList() {
  const queryClient = useQueryClient();
  const { inView, ref } = useInView();
  const [filterSection, setFilterSection] = useState("ALL");
  const [sortLastName, setSortLastName] = useState<"asc" | "desc" | "default">(
    "default"
  );
  const [searchUser, setSearchUser] = useState("");
  const debouncedValue = useDebounce(searchUser);
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["attendees", filterSection, sortLastName, debouncedValue],
      queryFn: async ({ pageParam = null }) => {
        const result = await axios.get(
          `${API_URL}/api/users?cursor=${
            pageParam || "null"
          }&filterSection=${filterSection}&search=${debouncedValue}&sort=${sortLastName}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
            },
          }
        );
        return result.data.data;
      },
      initialPageParam: null,
      getNextPageParam: (nextPage: AttendeesType[]) => {
        if (nextPage.length === 0) return null;
        return nextPage[nextPage.length - 1].id;
      },
      refetchInterval: 1000 * 60,
    });

  const { mutate } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axios.delete(`${API_URL}/api/users/${userId}`);
      return response.data.message;
    },
    onSuccess: (message: string) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
    },
  });
  const attendees = useMemo((): AttendeesType[] => {
    return data?.pages.flat() || [];
  }, [data?.pages]);
  const { mutate: timeOutMutate, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axios.patch(`${API_URL}/api/users/${userId}`);
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
      toast.success(message);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  return (
    <div className="flex flex-col gap-1.5 h-full">
      <h3 className="text-zinc-300 font-bold text-xl pb-3">Attendance List</h3>
      <div className="flex grow h-1 w-full flex-col">
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center">
            <div className="flex items-center gap-1.5">
              <Popover>
                <PopoverTrigger className="flex items-center gap-1 text-zinc-400/80 text-xs underline-offset-4 hover:underline decoration-zinc-400 p-2">
                  <span>
                    <IoFilter />
                  </span>
                  <span>Section</span>
                </PopoverTrigger>
                <PopoverContent className="w-[60px] p-2 bg-zinc-800 flex flex-col items-start border text-zinc-300 text-xs border-zinc-400/15">
                  {section.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterSection(s)}
                      className={`py-2 px-1.5 font-bold hover:bg-zinc-300/25 rounded-md text-start w-full ${
                        filterSection === s.toUpperCase() && "bg-zinc-300/25"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger className="flex items-center gap-1 text-zinc-400/80 text-xs underline-offset-4 hover:underline decoration-zinc-400 p-2">
                  <span>
                    <IoFilter />
                  </span>
                  <span>Sort Last Name</span>
                </PopoverTrigger>
                <PopoverContent className="w-[100px] p-2 bg-zinc-800 flex flex-col items-start border text-zinc-300 text-xs border-zinc-400/15">
                  {SORT_SELECTION.map((s) => (
                    <button
                      key={s.code}
                      onClick={() =>
                        setSortLastName(s.code as "asc" | "desc" | "default")
                      }
                      className={`py-2 px-1.5 font-bold hover:bg-zinc-300/25 rounded-md text-start w-full ${
                        sortLastName === s.code && "bg-zinc-300/25"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center border overflow-hidden border-zinc-400/25 rounded-xl p-1 w-1/2 relative">
            <label className="p-1 text-zinc-400">
              <IoSearch />
            </label>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Attendees"
              className="text-xs text-zinc-300 placeholder:text-zinc-300/40 outline-none p-1.5 grow"
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col grow h-full overflow-y-auto relative">
          <table>
            <thead className="sticky top-0 z-10 bg-[rgb(1,30,73)]">
              <tr className="text-center border border-zinc-400/20">
                {columns.map((c) => (
                  <th
                    key={c}
                    className={`p-2 text-zinc-300/70 text-sm font-bold w-[120px]`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendees.map((a, i) => (
                <tr key={i} className="text-center border border-zinc-400/20">
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.lastName}
                  </td>
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.firstName}
                  </td>
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.section}
                  </td>
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.status}
                  </td>
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.timeIn}
                  </td>
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.timeOut ? a.timeOut : "--:-- --"}
                  </td>
                  <td className="p-2.5 text-zinc-400 text-xs break-all">
                    {a.totalTime ? a.totalTime : "----"}
                  </td>
                  <td className="p-2.5 flex items-center justify-center gap-2">
                    <button
                      disabled={isPending}
                      onClick={() => mutate(a.id)}
                      className=" py-2 px-4 rounded-md text-zinc-400 cursor-pointer bg-red-500/65 text-xs"
                    >
                      <IoTrashBin />
                    </button>
                    {!a.timeOut && (
                      <button
                        onClick={() => timeOutMutate(a.id)}
                        className=" py-2 px-4 rounded-md text-zinc-400 cursor-pointer bg-secondary text-xs"
                      >
                        <IoTime />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendees.length >= 20 && !isFetchingNextPage && hasNextPage && (
            <div ref={ref} className="flex items-center justify-center pt-2">
              <Spinner className="size-7 text-zinc-400/40" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceList;
