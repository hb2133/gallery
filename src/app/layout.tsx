import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Gowun_Dodum,
  Inspiration,
  Nanum_Gothic_Coding,
  Noto_Sans_KR,
  Noto_Serif_KR,
} from "next/font/google";
import { AuthSessionProvider } from "@/app/shell/AuthSessionProvider";
import { InitialAppStateProvider } from "@/app/shell/InitialAppStateProvider";
import { GlobalDesign } from "@/design/GlobalDesign.global";
import { LoadInitialAppState } from "@/managers/InitialAppStateManager";
import { HomeCursorSection } from "@/panels/base/GalleryBasePanel/sections/HomeCursorSection/HomeCursorSection";
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

const notoSerifKorean = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
  weight: "400",
});

const nanumGothicCoding = Nanum_Gothic_Coding({
  variable: "--font-nanum-gothic-coding",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inspiration = Inspiration({
  variable: "--font-inspiration",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Archive — Photography & Stories",
  description:
    "건축, 인물, 여정과 일상의 장면을 기록하는 미니멀 포토 아카이브.",
};

const ThemeInitializationScript = `
  try {
    var StoredTheme = window.localStorage.getItem('gallery-theme');
    document.documentElement.dataset.theme =
      StoredTheme === 'dark' ? 'dark' : 'light';
  } catch (Error) {
    document.documentElement.dataset.theme = 'light';
  }
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const InitialState = await LoadInitialAppState();

  return (
    <html
      lang="ko"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKorean.variable} ${notoSerifKorean.variable} ${gowunDodum.variable} ${nanumGothicCoding.variable} ${inspiration.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ThemeInitializationScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <GlobalDesign />
        <AuthSessionProvider
          InitialUserEmail={InitialState.AdminEmail}
          Children={
            <InitialAppStateProvider
              InitialState={InitialState}
              Children={
                <>
                  <HomeCursorSection />
                  {children}
                </>
              }
            />
          }
        />
      </body>
    </html>
  );
}
