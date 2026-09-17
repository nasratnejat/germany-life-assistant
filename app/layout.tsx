import "./globals.css";
import AppShell from "../components/AppShell";
import { createClient } from "../lib/supabase/server";

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
      <body>
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
