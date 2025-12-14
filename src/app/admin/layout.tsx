import AdminProvider from "@/provider/AdminProvider";
import React, { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};
function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminProvider>{children}</AdminProvider>;
}

export default AdminLayout;
