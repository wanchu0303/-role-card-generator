# 中文角色卡生成器上线版

这是从本地 MVP 拆出来的上线项目骨架，包含：

- 用户登录：Supabase Auth
- 角色卡保存：Supabase Postgres
- 数据埋点：PostHog
- 访问统计：Vercel Analytics
- 导出：JSON、Markdown、Word

## 本地运行

先安装 Node.js 20+，然后：

```bash
cd webapp
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。

## Supabase 配置

1. 新建 Supabase 项目。
2. 在 SQL Editor 执行 `supabase/schema.sql`。
3. 打开 Authentication，启用 Email 登录。
4. 在 Auth URL Configuration 里，把本地和线上地址加入 Redirect URLs：
   - `http://localhost:3000/auth/callback`
   - `https://你的域名/auth/callback`
5. 把 Project URL 和 anon key 填入 `.env.local`。

## PostHog 配置

1. 新建 PostHog 项目。
2. 把 Project API Key 填入 `NEXT_PUBLIC_POSTHOG_KEY`。
3. 上线后重点看这些事件：
   - `generate_clicked`
   - `generate_success`
   - `card_saved`
   - `card_downloaded_json`
   - `card_downloaded_md`
   - `persona_tag_selected`
   - `plot_tag_selected`

## 部署到 Vercel

1. 推到 GitHub。
2. Vercel 导入项目。
3. Root Directory 选择 `webapp`。
4. 配置环境变量。
5. Deploy。
