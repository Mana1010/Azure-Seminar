"use client";
import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/environment";
import { TotalAttendanceType } from "@/types/shared.type";
import Snow from "@/components/Snow";

const chartConfig = {
  A: {
    label: " A",
    color: "#B3E5FC", // Light Azure
  },
  B: {
    label: " B",
    color: "#4FC3F7", // Sky Azure
  },
  C: {
    label: "C",
    color: "#03A9F4", // Azure
  },
  D: {
    label: "D",
    color: "#0288D1", // Deep Azure
  },
  CS: {
    label: "CS",
    color: "#01579B", // Dark Azure
  },
} satisfies ChartConfig;
function TotalAttendancePerSection() {
  const { data }: UseQueryResult<TotalAttendanceType[]> = useQuery({
    queryKey: ["reports", "total-attendees"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/reports/total-attendees`
      );
      return response.data.data;
    },
    refetchInterval: 1000 * 25,
  });
  const totalAttendees = data?.reduce((acc, val) => {
    return (acc += val.attendees);
  }, 0);

  function getTotalEach(section: "A" | "B" | "C" | "D" | "CS") {
    return data?.find((d) => d.name === section)?.attendees;
  }
  return (
    <div className="h-full rounded-md flex gap-2 flex-col relative ">
      <div className="flex flex-col h-full rounded-md border border-zinc-300/35 p-3">
        <h3 className="text-zinc-300/70 font-bold text-xs">Total Attendees</h3>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-1/2 p-4">
            <ChartContainer
              config={chartConfig}
              className="mx-auto size-[300px] p-4"
            >
              <PieChart>
                <ChartTooltip
                  // content={<ChartTooltipContent hideLabel />}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e5e5e5",
                    color: "#000000",
                    padding: "5px",
                  }}
                />
                <Pie data={data} dataKey="attendees" label nameKey="name" />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <h5 className="text-sm font-bold text-zinc-200">
              {totalAttendees} attendees
            </h5>
            <div className="grid grid-cols-3 items-center justify-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#B3E5FC]" />
                <span className="text-[0.65rem] text-zinc-400">
                  {getTotalEach("A") || 0} (Section A)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#4FC3F7]" />
                <span className="text-[0.65rem] text-zinc-400">
                  {getTotalEach("B") || 0} (Section B)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#03A9F4]" />
                <span className="text-[0.65rem] text-zinc-400">
                  {getTotalEach("C") || 0} (Section C)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0288D1]" />
                <span className="text-[0.65rem] text-zinc-400">
                  {getTotalEach("D") || 0} (Section D)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#01579B]" />
                <span className="text-[0.65rem] text-zinc-400">
                  {getTotalEach("CS") || 0} (Section CS)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalAttendancePerSection;
