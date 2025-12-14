import { DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import Snow from "@/components/Snow";
import { Dispatch, SetStateAction, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/environment";
import { toast } from "sonner";
import star from "../../../../public/christmas-star.png";
import { FaStar } from "react-icons/fa6";
import { Spinner } from "@/components/ui/spinner";
type RegisterSuccessfullyProps = {
  setIsOpenFeedbackDialog: Dispatch<SetStateAction<boolean>>;
};
function SubmitFeedback({
  setIsOpenFeedbackDialog,
}: RegisterSuccessfullyProps) {
  const [feedbackData, setFeedbackData] = useState({
    comment: "",
    rating: 0,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${API_URL}/api/feedback`,
        feedbackData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sessionId")}`,
          },
        }
      );
      return response.data.message;
    },
    onSuccess: (message) => {
      toast.success(message);
      setIsOpenFeedbackDialog(false);
      localStorage.removeItem("sessionId");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });
  return (
    <DialogContent
      showCloseButton={false}
      onInteractOutside={(e) => e.preventDefault()}
      className="border justify-between border-zinc-400/25] flex flex-col items-center bg-zinc-900 overflow-hidden"
    >
      <div className="flex items-center w-full justify-center relative">
        <div className={`flex items-center gap-2 flex-col`}>
          <Image src={star} width={70} height={70} priority alt="lights" />
          <span className={`text-white text-3xl`}>
            Share your{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[rgb(0,155,211)] to-[rgb(1,125,174)]">
              Feedback
            </span>
          </span>
          <p className="text-zinc-300 text-xs text-center">
            Thank you for attending the Microsoft Azure Introduction session.
            Please take a moment to rate your experience and share your feedback
            to help us improve future events and sessions.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="flex grow h-full w-full flex-col gap-2"
      >
        <div className="h-full w-full flex flex-col gap-4">
          <div className="flex items-center flex-col gap-2">
            <div className="flex items-center gap-1.5 w-full justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  type="button"
                  onClick={() =>
                    setFeedbackData((prev) => {
                      return {
                        ...prev,
                        rating: i + 1,
                      };
                    })
                  }
                  key={i}
                  className={`text-4xl  ${
                    feedbackData.rating >= i + 1
                      ? "text-yellow-400"
                      : "text-zinc-400"
                  } cursor-pointer`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
          <textarea
            onChange={(e) =>
              setFeedbackData((prev) => {
                return {
                  ...prev,
                  comment: e.target.value,
                };
              })
            }
            value={feedbackData.comment}
            placeholder="Share your experiences and learnings (optional)"
            className="border border-zinc-400/35 text-xs min-h-[100px] placeholder:text-zinc-400 p-2 rounded-md caret-zinc-500 text-zinc-300 resize-none h-full"
          ></textarea>
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-1.5">
          {/* <p className="text-zinc-400 text-xs py-1 text-center">
            Don&apos;t worry — your confession is completely anonymous. Your
            name will never appear.
          </p> */}
          <button
            disabled={feedbackData.rating <= 0 || isPending}
            type="submit"
            className="py-2 w-full rounded-md border disabled:cursor-not-allowed disabled:bg-zinc-500 border-zinc-400/40 text-zinc-300 bg-secondary relative overflow-hidden cursor-pointer group transition-all duration-150"
          >
            <span className="text-sm">
              {" "}
              {isPending ? (
                <div className="flex items-center gap-1.5 justify-center w-full">
                  <Spinner className="text-zinc-400 size-6" />
                  <span className="text-zinc-400 text-sm">Submitting</span>
                </div>
              ) : (
                "Submit"
              )}
            </span>
          </button>
          <button
            onClick={() => setIsOpenFeedbackDialog(false)}
            type="button"
            className="py-2 w-full rounded-md border disabled:cursor-not-allowed disabled:bg-zinc-500 border-zinc-400/40 text-zinc-300 bg-red-900 relative overflow-hidden cursor-pointer group transition-all duration-150"
          >
            <span className="text-sm"> No Thanks</span>
          </button>
        </div>
      </form>
    </DialogContent>
  );
}

export default SubmitFeedback;
