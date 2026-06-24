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
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <span className="chat-bubble">{msg.content}</span>
          </div>
        ))}
        {sending && (
          <div className="chat-message assistant">
            <span className="chat-typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`和 ${card.name} 说点什么…`}
          disabled={sending}
        />
        <button onClick={send} disabled={sending || !input.trim()}>
          发送
        </button>
      </div>
    </div>
  );
}
