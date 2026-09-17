"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, PanelLeftClose } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { CATEGORIES, FEATURES } from "@/lib/features";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, setOpenMobile, open, toggleSidebar } = useSidebar();
  const [openSlug, setOpenSlug] = useState<string | null>(
    CATEGORIES[0]?.slug ?? null,
  );

  function navigateTo(href: string) {
    router.push(href);
    if (isMobile) setOpenMobile(false);
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-slate-100 px-2 py-2">
        <div className="flex items-center justify-between px-1.5 py-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Menu
          </span>
          <button
            onClick={toggleSidebar}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <PanelLeftClose
              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                open ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {CATEGORIES.map((cat) => {
                const isOpen = openSlug === cat.slug;
                const categoryFeatures = FEATURES.filter(
                  (f) => f.category === cat.slug,
                );
                const isActiveCategory = categoryFeatures.some(
                  (f) => f.href === pathname,
                );

                return (
                  <SidebarMenuItem key={cat.slug}>
                    <SidebarMenuButton
                      onClick={() => setOpenSlug(isOpen ? null : cat.slug)}
                      className={`group rounded-lg px-2.5 py-2.5 transition-colors ${
                        isActiveCategory && !isOpen
                          ? "bg-teal-50 text-teal-700"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-colors [&_svg]:w-4 [&_svg]:h-4 ${
                          isOpen || isActiveCategory
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600"
                        }`}
                      >
                        {cat.icon}
                      </span>
                      <span className="text-[15px] font-medium">
                        {cat.title}
                      </span>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </SidebarMenuButton>

                    <div
                      className="overflow-hidden transition-all duration-200 ease-in-out"
                      style={{
                        maxHeight: isOpen
                          ? `${categoryFeatures.length * 40 + 8}px`
                          : "0px",
                      }}
                    >
                      <SidebarMenuSub className="mt-1 pl-2">
                        {categoryFeatures.map((f) => {
                          const isActive = pathname === f.href;
                          return (
                            <SidebarMenuSubItem key={f.href}>
                              <SidebarMenuSubButton
                                onClick={() => navigateTo(f.href)}
                                isActive={isActive}
                                className={`rounded-md text-[14px] px-2.5 py-2 transition-colors ${
                                  isActive
                                    ? "bg-teal-50 text-teal-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                <span className="truncate">{f.title}</span>
                                {f.ai && (
                                  <span className="ml-auto text-[9px] font-semibold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                    AI
                                  </span>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 px-2 py-2">
        <div className="flex items-center justify-between px-2 py-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            {FEATURES.length} tools ready
          </span>
          <span className="font-medium text-slate-300">v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
