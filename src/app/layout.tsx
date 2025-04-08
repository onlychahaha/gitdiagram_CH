import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { CSPostHogProvider } from "./providers";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "GitDiagram",
  description:
    "将任何GitHub仓库转换为交互式图表进行可视化，只需几秒钟。",
  metadataBase: new URL("https://gitdiagram.com"),
  keywords: [
    "github",
    "git图表",
    "git图表生成器",
    "git图表工具",
    "git图表制作器",
    "git图表创建器",
    "git图表",
    "图表",
    "仓库",
    "可视化",
    "代码结构",
    "系统设计",
    "软件架构",
    "软件设计",
    "软件工程",
    "软件开发",
    "软件架构",
    "软件设计",
    "软件工程",
    "软件开发",
    "开源",
    "开源软件",
    "ahmedkhaleel2004",
    "ahmed khaleel",
    "gitdiagram",
    "gitdiagram.com",
  ],
  authors: [
    { name: "Ahmed Khaleel", url: "https://github.com/ahmedkhaleel2004" },
  ],
  creator: "Ahmed Khaleel",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://gitdiagram.com",
    title: "GitDiagram - 几秒钟内将仓库转换为图表",
    description:
      "将任何GitHub仓库转换为交互式图表进行可视化。",
    siteName: "GitDiagram",
    images: [
      {
        url: "/og-image.png", // 您需要创建此图片
        width: 1200,
        height: 630,
        alt: "GitDiagram - 仓库可视化工具",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <CSPostHogProvider>
        <body className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
