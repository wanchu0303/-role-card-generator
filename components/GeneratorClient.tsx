"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatMarkdown, formatWordHtml, generateCard, PERSONA_TAGS, PLOT_TAGS } from "@/lib/generator";
import { initAnalytics, track } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ChatPanel } from "./ChatPanel";
import { KitchenAnimation } from "./KitchenAnimation";

type Props = {
  userEmail: string | null;
  supabaseReady: boolean;
};

export function GeneratorClient({ userEmail, supabaseReady }: Props) {
  const [currentEmail, setCurrentEmail] = useState(userEmail);
  const [idea, setIdea] = useState("冷淡医生，但会偷偷关心人");
  const [name, setName] = useState("沈既白");
  const [userName, setUserName] = useState("你");
  const [personaKeys, setPersonaKeys] = useState<string[]>(["daddy"]);
  const [plotKeys, setPlotKeys] = useState<string[]>(["touchStarved"]);
  const [tab, setTab] = useState<"card" | "export" | "chat">("card");
  const [status, setStatus] = useState("已载入默认示例。");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!supabaseReady) return;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? null);
    });
  }, [supabaseReady]);

  const card = useMemo(
    () => generateCard({ idea, name, userName, personaKeys, plotKeys }),
    [idea, name, userName, personaKeys, plotKeys]
  );

  const output = tab === "card" ? formatMarkdown(card) : JSON.stringify(card, null, 2);

  function toggle(list: string[], key: string) {
    return list.includes(key) ? list.filter((item) => item !== key) : [...list, key];
  }

  function generate() {
    track("generate_clicked", {
      persona_tags: personaKeys,
      plot_tags: plotKeys,
      input_length: idea.length
    });
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStatus(`已生成：${card.name}`);
      track("generate_success", {
        persona_tags: personaKeys,
        plot_tags: plotKeys,
        output_length: JSON.stringify(card).length
      });
    }, 2200);
  }

  async function saveCard() {
    if (!supabaseReady) {
      setStatus("保存需要先配置 Supabase。现在可以先生成和下载。");
      return;
    }

    track("card_save_clicked", { persona_tags: personaKeys, plot_tags: plotKeys });
    const response = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card, inputText: idea, personaTags: personaKeys, plotTags: plotKeys })
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "保存失败");
      return;
    }
    setStatus("已保存到我的角色卡");
    track("card_saved", { card_id: data.id, persona_tags: personaKeys, plot_tags: plotKeys });
  }

  async function signOut() {
    const { createSupabaseBrowserClient } = await import("@/lib/supabase/browser");
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setCurrentEmail(null);
    setStatus("已退出登录");
    track("logout_clicked", {});
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setStatus("已复制当前内容");
    track("card_copied", { tab });
  }

  function download(type: "json" | "md" | "doc") {
    const text = type === "json" ? JSON.stringify(card, null, 2) : type === "doc" ? formatWordHtml(card) : formatMarkdown(card);
    const mime = type === "doc" ? "application/msword;charset=utf-8" : "text/plain;charset=utf-8";
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${card.name || "character-card"}.${type}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    track(type === "json" ? "card_downloaded_json" : type === "doc" ? "card_downloaded_word" : "card_downloaded_md", { persona_tags: personaKeys, plot_tags: plotKeys });
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="topbar">
          <h1>中文角色卡生成器</h1>
        </div>

        <div className="user-info">
          {!supabaseReady ? (
            <span className="badge badge-accent">本地预览</span>
          ) : currentEmail ? (
            <>
              <span className="badge badge-success">已登录</span>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{currentEmail}</span>
            </>
          ) : (
            <span className="badge badge-accent">未登录</span>
          )}
          <span style={{ display: "flex", gap: 8 }}>
            {supabaseReady && !currentEmail && <Link href="/login">登录</Link>}
            {supabaseReady && currentEmail && <Link href="/my-cards">我的角色卡</Link>}
            {supabaseReady && currentEmail && <button className="ghost" style={{ padding: "4px 10px", minHeight: 0, fontSize: "0.78rem" }} onClick={signOut}>退出</button>}
          </span>
        </div>

        <div className="section">
          <div className="field">
            <label>自定义人设</label>
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="描述角色的性格、背景、特点…"
            />
          </div>
          <div className="field">
            <label>角色名</label>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="field">
            <label>你的称呼</label>
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="对话中怎么称呼你？"
            />
          </div>
        </div>

        <div className="section">
          <div className="tag-section-header">
            <h2>人设 Tag</h2>
            <span className="tag-count">{personaKeys.length} 已选</span>
          </div>
          <div className="tag-list">
            {Object.entries(PERSONA_TAGS).map(([key, tag]) => (
              <span
                key={key}
                className={`tag-pill ${personaKeys.includes(key) ? "selected" : ""}`}
                onClick={() => {
                  setPersonaKeys((value) => toggle(value, key));
                  track("persona_tag_selected", { tag: key });
                }}
                title={tag.desc}
              >
                <span className="pill-icon">✓</span>
                {tag.title}
              </span>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="tag-section-header">
            <h2>剧情 Tag</h2>
            <span className="tag-count">{plotKeys.length} 已选</span>
          </div>
          <p className="subtle" style={{ marginBottom: 12 }}>建议选 1 个作为开场剧情钩子</p>
          <div className="tag-list">
            {Object.entries(PLOT_TAGS).map(([key, tag]) => (
              <span
                key={key}
                className={`tag-pill ${plotKeys.includes(key) ? "selected" : ""}`}
                onClick={() => {
                  setPlotKeys((value) => toggle(value, key));
                  track("plot_tag_selected", { tag: key });
                }}
                title={tag.desc}
              >
                <span className="pill-icon">✓</span>
                {tag.title}
              </span>
            ))}
          </div>
        </div>

        <div className="actions" style={{ marginTop: 24 }}>
          <button className="primary" onClick={generate}>✨ 生成角色卡</button>
          <button onClick={saveCard}>💾 保存</button>
        </div>

        <div className="status-bar" style={{ marginTop: 14, marginBottom: 0 }}>
          <span className="status-dot" />
          <span>{status}</span>
        </div>
      </aside>

      <main className="main">
        <KitchenAnimation
          isGenerating={generating}
          characterName={card.name}
          onComplete={() => {}}
        />
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="tabs">
            <button className={`tab ${tab === "card" ? "active" : ""}`} onClick={() => setTab("card")}>
              📄 角色卡
            </button>
            <button className={`tab ${tab === "export" ? "active" : ""}`} onClick={() => setTab("export")}>
              📤 导出
            </button>
            <button
              className={`tab ${tab === "chat" ? "active" : ""}`}
              onClick={() => {
                setTab("chat");
                track("chat_tab_opened", { card_name: card.name });
              }}
            >
              💬 试聊
            </button>
          </div>
          {tab === "chat" ? (
            <ChatPanel card={card} />
          ) : (
            <>
              <div className="output">{output}</div>
              <div className="actions">
                <button onClick={copy}>📋 复制内容</button>
                <button onClick={() => download("md")}>⬇ Markdown</button>
                <button onClick={() => download("json")}>⬇ JSON</button>
                <button onClick={() => download("doc")}>⬇ Word</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
