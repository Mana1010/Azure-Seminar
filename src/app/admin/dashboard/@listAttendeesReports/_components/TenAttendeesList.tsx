"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import { API_URL } from "@/environment";
const sort = [
  {
    name: "Early",
    code: "asc",
  },
  {
    name: "Late",
    code: "desc",
  },
];
function TenAttendeesList() {
  const [sortBy, setSortBy] = useState("asc");
  const {
    data,
    isLoading,
  }: UseQueryResult<{ name: string; year: string; timeIn: string }[]> =
    useQuery({
      queryKey: ["reports", "ten-attendees", sortBy],
      queryFn: async () => {
        const response = await axios.get(
          `${API_URL}/api/reports/attendees-list?sort=${sortBy}`
        );
        return response.data.data;
      },
    });
  return (
    <div className="h-full p-3 flex flex-col overflow-hidden border border-zinc-300/35 rounded-md w-[300px] ">
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-zinc-300/70 font-bold text-xs">
          Top 10 {sortBy === "asc" ? "Earliest" : "Latest"} Time In
        </h3>
        <Select required value={sortBy} onValueChange={(val) => setSortBy(val)}>
          <SelectTrigger className="w-20 p-2 text-xs border-zinc-400/35 text-zinc-300">
            <SelectValue placeholder="Select your year" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-0 ">
            <SelectGroup>
              {sort.map((y) => (
                <SelectItem
                  value={y.code}
                  key={y.code}
                  className="text-zinc-400 text-sm hover:bg-zinc-300/10 cursor-pointer"
                >
                  {y.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </header>
      {data && !isLoading && (
        <div className="flex grow flex-col gap-1 w-full mt-2 h-1 overflow-y-auto dashboard-scroll">
          {data.map((d, i) => (
            <div
              key={i}
              className={`w-full rounded-md  flex justify-between items-center gap-3 p-1.5 backdrop-blur-md border border-zinc-400/25 `}
            >
              <div className="flex items-center grow justify-between">
                <div className="flex flex-col relative z-10 line-clamp-1 grow">
                  <h5 className="text-zinc-300 font-bold text-xs">{d.name}</h5>
                  <h6 className="text-zinc-300/85 text-xs">{d.year}</h6>
                </div>
                <h6 className={` text-xs text-zinc-400 font-bold`}>
                  ({d.timeIn})
                </h6>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TenAttendeesList;
