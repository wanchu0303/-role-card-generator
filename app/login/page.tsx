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

  function validate() {
    if (!hasSupabaseEnv()) {
      setMessage("需要先配置 Supabase 环境变量，才能使用登录。");
      return false;
    }
    if (!email || !password) {
      setMessage("请填写邮箱和密码。");
      return false;
    }
    if (password.length < 6) {
      setMessage("密码至少需要 6 位。");
      return false;
    }
    return true;
  }

  async function signIn() {
    if (!validate()) return;
    const supabase = createSupabaseBrowserClient();
    setMessage("正在登录...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    track("login_success", {});
    router.push("/");
    router.refresh();
  }

  async function signUp() {
    if (!validate()) return;
    const supabase = createSupabaseBrowserClient();
    setMessage("正在注册...");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    track("signup_success", {});
    setMessage("注册成功。如果 Supabase 要求邮箱确认，请先去邮箱点确认链接；否则可以直接登录。");
  }

  return (
    <main className="main">
      <div className="panel" style={{ maxWidth: 460, margin: "60px auto" }}>
        <h1>登录 / 注册</h1>
        <p className="subtle">使用邮箱和密码登录。第一次使用先点注册。</p>
        <div className="field" style={{ marginTop: 18 }}>
          <label>邮箱</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>密码</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="至少 6 位"
          />
        </div>
        <div className="actions">
          <button className="primary" onClick={signIn}>登录</button>
          <button onClick={signUp}>注册</button>
        </div>
        {message && <p className="subtle" style={{ marginTop: 12 }}>{message}</p>}
      </div>
    </main>
  );
}
