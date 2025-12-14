"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/environment";

export const description = "A mixed bar chart";

const chartConfig = {
  ratings: {
    label: "Ratings",
  },
  fiveStar: {
    label: "5 ⭐",
    color: "#FACC15",
  },
  fourStar: {
    label: "4 ⭐",
    color: "#FDE047",
  },
  threeStar: {
    label: "3 ⭐",
    color: "#FEF08A",
  },
  twoStar: {
    label: "2 ⭐",
    color: "#FEF9C3",
  },
  oneStar: {
    label: "1 ⭐",
    color: "#FFFBEB",
  },
} satisfies ChartConfig;

export function TotalFeedback() {
  const {
    data,
  }: UseQueryResult<{
    ratings: { rating: number; name: string; fill: string }[];
    totalFeedback: number;
  }> = useQuery({
    queryKey: ["reports", "total-rating"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/reports/total-rating`);
      return response.data.data;
    },
  });

  const totalRatings = data?.ratings.reduce((acc, val) => {
    return acc + val.rating;
  }, 0);
  return (
    <div className="w-full flex flex-col gap-2 h-full">
      <h3 className="text-zinc-300/70 font-bold text-xs">
        Total Ratings and Feedback
      </h3>
      {data && (
        <div className="flex flex-col w-full gap-4 h-full">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data.ratings}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <XAxis dataKey="rating" type="number" hide />
              <Bar dataKey="rating" layout="vertical" radius={5} />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="border-none text-white"
                    formatter={(value) => (
                      <span className="text-white font-semibold">
                        Total Stars: {value}{" "}
                        {/* or format it: ${value.toFixed(2)} */}
                      </span>
                    )}
                  />
                }
                wrapperStyle={{
                  outline: "none",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  paddingBlock: "4px",
                  backgroundColor: "oklch(27.4% 0.006 286.033)",
                  padding: "0.375rem",
                  color: "#ffff",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </BarChart>
          </ChartContainer>
          <div className="gap-2 items-center h-full flex flex-col justify-center w-full grow ">
            <div className="rounded-md border w-full border-zinc-400/25 h-full p-2 relative bg-zinc-800">
              <h5 className="text-zinc-300 text-xs font-bold">Total Ratings</h5>
              <h6 className="text-zinc-300 font-extrabold text-xl">
                {totalRatings} ⭐
              </h6>
            </div>
            <div className="rounded-md border w-full border-zinc-400/25 h-full p-2 relative bg-zinc-800">
              <h5 className="text-zinc-300 text-xs font-bold">
                Total Feedback
              </h5>
              <h6 className="text-zinc-300 font-extrabold text-xl">
                {data.totalFeedback || 0}
              </h6>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
