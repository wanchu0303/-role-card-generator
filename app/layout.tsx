import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "中文角色卡生成器",
  description: "面向 Chub / 酒馆的中文角色卡生成器",
  openGraph: {
    title: "中文角色卡生成器",
    description: "面向 Chub / 酒馆的中文角色卡生成器",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
