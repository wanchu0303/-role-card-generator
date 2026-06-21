"use client";

import { useEffect, useRef, useState } from "react";
import type { GeneratedCard } from "@/lib/generator";
import { track } from "@/lib/analytics";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel({ card }: { card: GeneratedCard }) {
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: "assistant", content: card.first_message }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    track("chat_message_sent", { card_name: card.name });

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: card.system_prompt },
            ...next
          ]
        })
      });
      const data = await res.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        track("chat_reply_received", { card_name: card.name });
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: `（${data.error || "回复失败"}）` }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "（网络错误，请稍后重试）" }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflow: "auto", padding: "0 0 8px 0" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: msg.role === "user" ? "right" : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                maxWidth: "80%",
                padding: "8px 14px",
                borderRadius: 14,
                background: msg.role === "user" ? "#3b82f6" : "#f1f5f9",
                color: msg.role === "user" ? "#fff" : "#1e293b",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 14,
                lineHeight: 1.6
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div style={{ textAlign: "left", marginBottom: 12 }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: 14,
                background: "#f1f5f9",
                color: "#94a3b8",
                fontSize: 14
              }}
            >
              正在输入...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`和${card.name}说点什么...`}
          disabled={sending}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            fontSize: 14,
            outline: "none"
          }}
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: sending || !input.trim() ? "#cbd5e1" : "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: sending || !input.trim() ? "default" : "pointer",
            fontSize: 14,
            fontWeight: 500
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
}
