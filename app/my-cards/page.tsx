import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export default async function MyCardsPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="main">
        <div className="panel">
          <h1>我的角色卡</h1>
          <p className="subtle">需要先配置 Supabase，才能保存和查看角色卡。</p>
          <Link href="/">返回生成器</Link>
        </div>
      </main>
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) redirect("/login");

  const { data: cards } = await supabase
    .from("cards")
    .select("id,name,tagline,persona_tags,plot_tags,created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="main">
      <div className="topbar">
        <div>
          <h1>我的角色卡</h1>
          <p className="subtle">已保存的生成记录。</p>
        </div>
        <Link href="/">返回生成器</Link>
      </div>
      <div className="panel">
        {!cards?.length && <p className="subtle">还没有保存角色卡。</p>}
        {cards?.map((card) => (
          <div key={card.id} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
            <strong>{card.name}</strong>
            <p className="subtle">{card.tagline}</p>
            <p className="subtle">{[...(card.persona_tags ?? []), ...(card.plot_tags ?? [])].join(" / ")}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
