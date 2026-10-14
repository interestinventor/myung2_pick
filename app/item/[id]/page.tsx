import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
type Props = {
    params: Promise<{ id: string }>;
  };

// 1. 동적 메타데이터 생성 (구글 검색 노출용 SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params; // await 추가
    const { data: item } = await supabase.from("archives").select("*").eq("id", id).single();
    
    if (!item) return {};
  
    return {
      title: `${item.product_name} - M-chive 소비왕의 종결템`,
      description: item.comment,
      openGraph: {
        images: [item.thumbnail_url || ''],
      },
    };
  }

  export default async function ItemDetail({ params }: Props) {
    const { id } = await params; // await 추가
    
    const { data: item, error } = await supabase
      .from("archives")
      .select("*")
      .eq("id", id) // id로 변경
      .single();
  
    if (error || !item) {
      notFound();
    }

  // 2. AI 검색엔진(AIO)을 위한 기계 판독용 데이터 (JSON-LD Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": item.product_name,
    "image": item.thumbnail_url,
    "description": item.comment,
    "category": item.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "KRW",
      "description": item.price_info,
    }
  };

  return (
    <article className="max-w-2xl mx-auto py-8">
      {/* 백그라운드에 JSON-LD 심기 (화면엔 안 보이고 봇들만 읽음) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* 상단 썸네일 */}
        <div className="aspect-[16/9] bg-gray-100 relative">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt={item.product_name} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
          )}
        </div>

        <div className="p-8">
          {/* 헤더 & 요약 (AI가 가장 먼저 긁어가는 부분) */}
          <div className="mb-8">
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {item.category} 종결템
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{item.product_name}</h1>
            <p className="mt-4 text-xl font-medium text-gray-700 leading-snug">
              "{item.comment}"
            </p>
          </div>

          <div className="h-px bg-gray-100 my-8"></div>

          {/* 본문 구조화 데이터 (불릿 포인트 형태로 구성) */}
          <div className="space-y-8">
            {/* 장점 (pros 배열이 있다고 가정) */}
            {item.pros && item.pros.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>✅</span> 왜 이 아이템이 정답인가요?
                </h2>
                <ul className="mt-4 space-y-3">
                  {item.pros.map((pro: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 추천 대상 */}
            {item.target_audience && (
              <section className="bg-gray-50 p-5 rounded-xl">
                <h2 className="text-sm font-bold text-gray-900 mb-2">🎯 이런 분들께 추천합니다</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{item.target_audience}</p>
              </section>
            )}

            {/* 아쉬운 점 (단점) */}
            {item.cons && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-2">🤔 구매 전 체크포인트</h2>
                <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-red-200 pl-3">
                  {item.cons}
                </p>
              </section>
            )}
          </div>

          <div className="h-px bg-gray-100 my-8"></div>

          {/* 하단 구매/전환 링크 */}
          <div className="flex flex-col gap-3">
            {item.link_coupang && (
              <a href={item.link_coupang} target="_blank" rel="noreferrer" className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors">
                🛒 쿠팡에서 가격 확인하기
              </a>
            )}
            {item.link_naver && (
              <a href={item.link_naver} target="_blank" rel="noreferrer" className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors">
                🟢 네이버 쇼핑 검색결과 보기
              </a>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            {item.price_info && `참고 가격: ${item.price_info}`}
          </p>
        </div>
      </div>
    </article>
  );
}