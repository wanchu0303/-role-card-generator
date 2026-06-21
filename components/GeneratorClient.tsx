"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatMarkdown, formatWordHtml, generateCard, PERSONA_TAGS, PLOT_TAGS } from "@/lib/generator";
import { initAnalytics, track } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ChatPanel } from "./ChatPanel";

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
    setStatus(`已生成：${card.name}`);
    track("generate_success", {
      persona_tags: personaKeys,
      plot_tags: plotKeys,
      output_length: JSON.stringify(card).length
    });
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
        <p className="subtle">
          {!supabaseReady ? "当前是未接 Supabase 的本地预览模式，可以生成和下载，暂不能登录保存。" : currentEmail ? `已登录：${currentEmail}` : "未登录也能生成，登录后可保存。"}
          {" "}
          {supabaseReady ? currentEmail ? (
            <>
              <Link href="/my-cards">我的角色卡</Link>
              {" "}
              <button onClick={signOut} style={{ minHeight: 0, padding: "4px 8px" }}>退出</button>
            </>
          ) : <Link href="/login">登录</Link> : null}
        </p>
        <p className="subtle">支持导出：JSON / Markdown / Word</p>

        <div className="section">
          <div className="field">
            <label>自定义人设</label>
            <textarea value={idea} onChange={(event) => setIdea(event.target.value)} />
          </div>
          <div className="field">
            <label>角色名</label>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="field">
            <label>用户称呼</label>
            <input value={userName} onChange={(event) => setUserName(event.target.value)} />
          </div>
        </div>

        <div className="section">
          <h2>选择人设 Tag</h2>
          <div className="tag-list">
            {Object.entries(PERSONA_TAGS).map(([key, tag]) => (
              <label className="tag-option" key={key}>
                <input
                  type="checkbox"
                  checked={personaKeys.includes(key)}
                  onChange={() => {
                    setPersonaKeys((value) => toggle(value, key));
                    track("persona_tag_selected", { tag: key });
                  }}
                />
                <span>
                  <span className="tag-title">{tag.title}</span>
                  <span className="tag-desc">{tag.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>选择剧情 Tag</h2>
          <p className="subtle">建议选 1 个作为开场剧情钩子。</p>
          <div className="tag-list">
            {Object.entries(PLOT_TAGS).map(([key, tag]) => (
              <label className="tag-option" key={key}>
                <input
                  type="checkbox"
                  checked={plotKeys.includes(key)}
                  onChange={() => {
                    setPlotKeys((value) => toggle(value, key));
                    track("plot_tag_selected", { tag: key });
                  }}
                />
                <span>
                  <span className="tag-title">{tag.title}</span>
                  <span className="tag-desc">{tag.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="actions">
          <button className="primary" onClick={generate}>生成角色卡</button>
          <button onClick={saveCard}>保存</button>
        </div>
        <p className="subtle">{status}</p>
      </aside>

      <main className="main">
        <div className="panel">
          <div className="tabs">
            <button className={`tab ${tab === "card" ? "active" : ""}`} onClick={() => setTab("card")}>角色卡</button>
            <button className={`tab ${tab === "export" ? "active" : ""}`} onClick={() => setTab("export")}>导出</button>
            <button className={`tab ${tab === "chat" ? "active" : ""}`} onClick={() => { setTab("chat"); track("chat_tab_opened", { card_name: card.name }); }}>试聊</button>
          </div>
          {tab === "chat" ? (
            <ChatPanel card={card} />
          ) : (
            <>
              <div className="output">{output}</div>
              <div className="actions">
                <button onClick={copy}>复制当前内容</button>
                <button onClick={() => download("md")}>下载 Markdown</button>
                <button onClick={() => download("json")}>下载 JSON</button>
                <button onClick={() => download("doc")}>下载 Word</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
