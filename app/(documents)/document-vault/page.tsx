import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DocumentVaultView from "@/components/DocumentVaultView";

export default async function DocumentVaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("expiry", { ascending: true });

  return <DocumentVaultView initialDocs={documents ?? []} />;
}
