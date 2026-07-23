import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { GlobalDesign } from "@/design/GlobalDesign.global";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKorean = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Archive — Photography & Stories",
  description:
    "건축, 인물, 여정과 일상의 장면을 기록하는 미니멀 포토 아카이브.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKorean.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalDesign />
        {children}
      </body>
    </html>
  );
}
