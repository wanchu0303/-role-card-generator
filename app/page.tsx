import { GeneratorClient } from "@/components/GeneratorClient";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!hasSupabaseEnv()) {
    return <GeneratorClient userEmail={null} supabaseReady={false} />;
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return <GeneratorClient userEmail={data.user?.email ?? null} supabaseReady />;
}
