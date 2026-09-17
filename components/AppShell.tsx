"use client";

import dynamic from "next/dynamic";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navbar from "./Navbar";

const AppSidebar = dynamic(() => import("./AppSidebar"), { ssr: false });

export default function AppShell({ children, user }) {
  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider className="flex flex-col h-screen w-full">
      <Navbar user={user} />
      <div className="flex flex-1 min-h-0 w-full">
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
