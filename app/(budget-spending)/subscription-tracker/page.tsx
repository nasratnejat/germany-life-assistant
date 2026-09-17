import { createClient } from "@/lib/supabase/server";
import SubscriptionTrackerView from "@/components/SubscriptionTrackerView";

export default async function SubscriptionTrackerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <SubscriptionTrackerView
      initialSubscriptions={subscriptions || []}
      userId={user.id}
    />
  );
}
