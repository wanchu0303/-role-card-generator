import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export default async function MyCardsPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="main">
        <div className="empty-state">
          <div className="icon">🗄️</div>
          <h1>我的角色卡</h1>
          <p>需要先配置 Supabase，才能保存和查看角色卡。</p>
          <Link href="/">
            <button className="primary">返回生成器</button>
          </Link>
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
      <div className="cards-header">
        <div>
          <h1>我的角色卡</h1>
          <p className="subtle">已保存 {cards?.length ?? 0} 张角色卡</p>
        </div>
        <Link href="/">
          <button>← 返回生成器</button>
        </Link>
      </div>

      {!cards?.length ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>还没有保存任何角色卡</p>
          <Link href="/">
            <button className="primary">去生成第一张</button>
          </Link>
        </div>
      ) : (
        <div>
          {cards.map((card) => (
            <div key={card.id} className="card-item">
              <div className="card-icon">
                {card.name?.charAt(0) || "?"}
              </div>
              <div className="card-info">
                <strong>{card.name}</strong>
                {card.tagline && <div className="tagline">{card.tagline}</div>}
                <div className="card-tags">
                  {[...(card.persona_tags ?? []), ...(card.plot_tags ?? [])].map((tag) => (
                    <span key={tag} className="card-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
