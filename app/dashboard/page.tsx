import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountView from "@/components/AccountView";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AccountView user={user} />;
}
