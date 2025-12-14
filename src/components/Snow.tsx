import React from "react";
import { cn } from "@/lib/utils";

type SnowProps = {
  className?: string;
};

function Snow({ className }: SnowProps) {
  return (
    <>
      <span
        className={cn(
          "absolute top-[8%] left-[12%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[2px] group-hover:translate-y-[-2px] group-hover:rotate-6 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[18%] left-[74%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-1px] group-hover:translate-y-[3px] group-hover:-rotate-3 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute top-[42%] left-[33%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[3px] group-hover:translate-y-[1px] group-hover:rotate-12 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[63%] left-[59%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-2px] group-hover:translate-y-[0.5px] group-hover:-rotate-6 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute top-[27%] left-[88%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:rotate-3 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[72%] left-[5%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[0.5px] group-hover:translate-y-[2px] group-hover:-rotate-4 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute top-[66%] left-[21%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-1px] group-hover:translate-y-[-3px] group-hover:rotate-5 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[40%] left-[47%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[2px] group-hover:translate-y-[0.5px] group-hover:-rotate-8 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute top-[14%] left-[63%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-3px] group-hover:translate-y-[1px] group-hover:rotate-7 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[55%] left-[92%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[1px] group-hover:translate-y-[2px] group-hover:-rotate-5 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute top-[75%] left-[18%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-1px] group-hover:translate-y-[-2px] group-hover:rotate-4 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[22%] left-[38%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[3px] group-hover:translate-y-[1px] group-hover:-rotate-6 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>
      <span
        className={cn(
          "absolute top-[28%] left-[86%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-2px] group-hover:translate-y-[1px] group-hover:rotate-8 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>
      <span
        className={cn(
          "absolute top-[33%] left-[56%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-2px] group-hover:translate-y-[1px] group-hover:rotate-8 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute bottom-[68%] left-[79%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[1px] group-hover:translate-y-[3px] group-hover:-rotate-7 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>

      <span
        className={cn(
          "absolute top-[11%] left-[95%] text-zinc-300/50 text-sm opacity-80 group-hover:translate-x-[-1px] group-hover:translate-y-[-3px] group-hover:rotate-5 transition-transform duration-500 ease-in-out",
          className
        )}
      >
        ❄
      </span>
    </>
  );
}

export default Snow;
