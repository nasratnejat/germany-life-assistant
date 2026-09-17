"use client";

import dynamic from "next/dynamic";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navbar from "./Navbar";

const AppSidebar = dynamic(() => import("./AppSidebar"), { ssr: false });

export default function AppShell({ children, user }) {
  if (!user) {
    // No logged-in user — the middleware only lets /login through in this case,
    // so just render it full-screen with no sidebar/navbar.
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar user={user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
