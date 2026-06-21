import { NextResponse } from "next/server";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "保存需要先配置 Supabase" }, { status: 503 });
  }

  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "请先登录再保存" }, { status: 401 });
  }

  const body = await request.json();
  const card = body.card;

  if (!card?.name) {
    return NextResponse.json({ error: "角色卡内容不完整" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id: auth.user.id,
      name: card.name,
      tagline: card.tagline,
      persona_tags: body.personaTags ?? [],
      plot_tags: body.plotTags ?? [],
      card_json: card,
      input_text: body.inputText ?? ""
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
