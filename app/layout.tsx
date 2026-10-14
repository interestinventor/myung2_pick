import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "명이pick | 소비왕의 아카이브",
  description: "뭐사야돼? 했을 때 가장 생각나는 답변을 모아두었습니다.",
  verification: {
    google: "3tyPvQWWG-OoNPS79_SeWWsNL5NOh8VUsCQwAb6TGPM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 text-gray-900">
        <div className="flex flex-col md:flex-row min-h-screen">
          
          {/* 좌측 사이드바 */}
          <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 md:p-8 flex flex-col md:sticky md:top-0 md:h-screen">
            <div className="mb-8">
              <Link href="/" className="text-2xl font-bold tracking-tight text-black hover:opacity-80">
                명이pick
              </Link>
              <p className="mt-2 text-sm text-gray-500 font-medium">소비왕의 아카이브</p>
              <p className="mt-4 text-xs text-gray-400 leading-relaxed break-keep">
                뭐사야돼? 했을 때 가장 생각나는<br/>답변을 모아두었습니다.
              </p>
            </div>

            <nav className="flex-1 mb-8">
              <ul className="space-y-1 text-sm font-medium text-gray-600">
                <li>
                  <Link href="/" className="block py-2 px-3 rounded-md bg-gray-100 text-black transition-colors">
                    전체 보기
                  </Link>
                </li>
                {/* 추후 카테고리 필터가 여기에 추가됩니다 */}
              </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100 space-y-3">
              <a href="https://blog.naver.com/myung2_" target="_blank" rel="noreferrer" className="flex items-center text-xs text-gray-500 hover:text-black transition-colors">
                🌐 Blog (@myung2_)
              </a>
              <a href="https://instagram.com/myung2_" target="_blank" rel="noreferrer" className="flex items-center text-xs text-gray-500 hover:text-black transition-colors">
                📸 Instagram (@myung2_)
              </a>
            </div>
          </aside>

          {/* 우측 메인 콘텐츠 (상품 리스트가 들어갈 자리) */}
          <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}