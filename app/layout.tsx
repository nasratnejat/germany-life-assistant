import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Klar",
  description: "Your personal helper for German paperwork.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={jakarta.className}>
        <div className="fixed inset-0 -z-10 overflow-hidden bg-white pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-sky-200/50 rounded-full blur-3xl" />
          <div className="absolute top-1/4 -right-40 w-[34rem] h-[34rem] bg-teal-200/45 rounded-full blur-3xl" />
          <div className="absolute -bottom-48 left-1/3 w-[28rem] h-[28rem] bg-emerald-100/40 rounded-full blur-3xl" />
        </div>
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
