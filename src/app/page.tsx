import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/goals");
  }

  redirect("/welcome");
}
