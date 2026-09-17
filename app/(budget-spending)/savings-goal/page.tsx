import { createClient } from "@/lib/supabase/server";
import SavingsGoalView from "@/components/SavingsGoalView";

export default async function SavingsGoalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: goals } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return <SavingsGoalView initialGoals={goals || []} userId={user.id} />;
}
