"use client";
import { FaMask } from "react-icons/fa";

import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/environment";
import { FeedbackType } from "@/types/shared.type";

import { useEffect, useMemo } from "react";

import { useInView } from "react-intersection-observer";
import star from "../../../../../public/christmas-star.png";
import { Spinner } from "@/components/ui/spinner";
import { IoPerson } from "react-icons/io5";
import { format } from "date-fns";
function FeedbackList() {
  const { inView, ref } = useInView();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feedback"],
      queryFn: async ({ pageParam = null }) => {
        const response = await axios.get(
          `${API_URL}/api/feedback?cursor=${pageParam}`
        );
        return response.data.data;
      },
      initialPageParam: null,
      getNextPageParam: (nextPage: FeedbackType[]) => {
        if (nextPage.length === 0) return null;
        return nextPage[nextPage.length - 1].id;
      },
      refetchInterval: 1000 * 60,
    });

  const feedback = useMemo(
    (): FeedbackType[] => data?.pages.flat() || [],
    [data?.pages]
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div className="flex flex-col gap-1.5 h-full relative">
      <h3 className="text-zinc-300 font-bold text-xl pb-3">Feedback List</h3>
      <div className="flex flex-col gap-1.5">
        {data && (
          <div className="grid w-full grid-cols-3 gap-2">
            {feedback.map((f) => (
              <div key={f.id}>
                <div className="relative p-2.5 rounded-md border border-zinc-300/25 max-h-[300px] break-all flex flex-col group cursor-pointer">
                  <Image
                    src={star}
                    width={40}
                    height={40}
                    alt="star"
                    priority
                    className="absolute bottom-2 right-2 opacity-50"
                  />

                  <div className="flex items-center gap-2 pb-4 relative z-3">
                    <span className="text-lg text-zinc-300/65">
                      <IoPerson />
                    </span>
                    <div className="flex flex-col text-zinc-300/65">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.7rem]">
                          {f.author.firstName} {f.author.lastName}
                        </span>
                        {Array.from({ length: f.rating || 0 }).map((_, i) => (
                          <span key={i} className="text-xs">
                            ⭐
                          </span>
                        ))}
                      </div>

                      <span className="text-[0.6rem] text-zinc-400/65 font-bold text-start">
                        {format(f.createdAt, "Pp")}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 text-start z-3 overflow-y-auto grow">
                    {f.comment}
                  </p>
                </div>
                {/* <Confession c={c} setConfessionId={setConfessionId} /> */}
              </div>
            ))}
            {feedback.length >= 20 && hasNextPage && !isFetchingNextPage && (
              <div ref={ref} className="flex items-center justify-center">
                <Spinner className="size-8 text-zinc-400/35" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackList;
