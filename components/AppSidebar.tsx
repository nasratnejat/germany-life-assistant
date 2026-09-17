"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { CATEGORIES, FEATURES } from "../lib/features";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openSlug, setOpenSlug] = useState(CATEGORIES[0]?.slug ?? null);

  return (
    <Sidebar>
      <SidebarHeader>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 px-2 py-2 text-left w-full"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            K
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-slate-900 leading-tight">
              Klar
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              German paperwork, simplified
            </div>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {CATEGORIES.map((cat) => {
                const isOpen = openSlug === cat.slug;
                return (
                  <SidebarMenuItem key={cat.slug}>
                    <SidebarMenuButton
                      onClick={() => setOpenSlug(isOpen ? null : cat.slug)}
                    >
                      <span className="[&_svg]:w-4 [&_svg]:h-4">
                        {cat.icon}
                      </span>
                      <span>{cat.title}</span>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>

                    {isOpen && (
                      <SidebarMenuSub>
                        {FEATURES.filter((f) => f.category === cat.slug).map(
                          (f) => (
                            <SidebarMenuSubItem key={f.href}>
                              <SidebarMenuSubButton
                                onClick={() => router.push(f.href)}
                                isActive={pathname === f.href}
                              >
                                {f.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                        )}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-1.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {FEATURES.length} tools ready
          </span>
          <span>v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
