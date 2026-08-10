import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKorean.variable} h-full antialiased`}
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
