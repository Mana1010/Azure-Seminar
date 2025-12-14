import { ReactNode } from "react";

type DashboardLayoutProps = {
  totalAttendeesReports: ReactNode;
  otherReports: ReactNode;
  listAttendeesReports: ReactNode;
};
function DashboardLayout({
  totalAttendeesReports,
  listAttendeesReports,
  otherReports,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col gap-1.5 h-full w-full">
      <h3 className="text-zinc-300 font-bold text-xl pb-3">Dashboard</h3>
      <div className="grow flex items-center gap-2 pt-3 h-1">
        {otherReports}
        {totalAttendeesReports}
        {listAttendeesReports}
      </div>
    </div>
  );
}

export default DashboardLayout;
