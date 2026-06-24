"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/browser";
import { track } from "@/lib/analytics";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"error" | "success" | "info">("info");

  function validate() {
    if (!hasSupabaseEnv()) {
      setMessage("需要先配置 Supabase 环境变量，才能使用登录。");
      setMsgType("error");
      return false;
    }
    if (!email || !password) {
      setMessage("请填写邮箱和密码。");
      setMsgType("error");
      return false;
    }
    if (password.length < 6) {
      setMessage("密码至少需要 6 位。");
      setMsgType("error");
      return false;
    }
    return true;
  }

  async function signIn() {
    if (!validate()) return;
    const supabase = createSupabaseBrowserClient();
    setMessage("正在登录…");
    setMsgType("info");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setMsgType("error");
      return;
    }

    track("login_success", {});
    router.push("/");
    router.refresh();
  }

  async function signUp() {
    if (!validate()) return;
    const supabase = createSupabaseBrowserClient();
    setMessage("正在注册…");
    setMsgType("info");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (error) {
      setMessage(error.message);
      setMsgType("error");
      return;
    }

    track("signup_success", {});
    setMessage("注册成功！请查收确认邮件（可能需 1-2 分钟，检查垃圾箱），点击链接后即可登录。");
    setMsgType("success");
  }

  return (
    <main className="main">
      <div className="login-container">
        <div className="login-card">
          <h1>欢迎回来</h1>
          <p className="subtle">登录以保存和管理你的角色卡</p>
          <div className="field" style={{ marginTop: 8 }}>
            <label>邮箱</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label>密码</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="至少 6 位"
              autoComplete="current-password"
            />
          </div>
          <div className="actions">
            <button className="primary" onClick={signIn} style={{ flex: 1 }}>登录</button>
            <button onClick={signUp} style={{ flex: 1 }}>注册</button>
          </div>
          {message && (
            <div className={`login-message ${msgType}`}>
              {message}
            </div>
          )}
          <p className="subtle" style={{ marginTop: 20, textAlign: "center" }}>
            <a href="/">← 返回生成器</a>
          </p>
        </div>
      </div>
    </main>
  );
}
