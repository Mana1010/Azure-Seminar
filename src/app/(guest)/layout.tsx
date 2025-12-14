import React, { ReactNode } from "react";

type GuestLayoutProps = {
  children: ReactNode;
};
function GuestLayout({ children }: GuestLayoutProps) {
  return <div className=" h-full w-full">{children}</div>;
}

export default GuestLayout;
