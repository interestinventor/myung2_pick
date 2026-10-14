import { supabase } from "@/lib/supabase";
import { headers } from "next/headers"; // 1. headers 불러오기 추가
import Link from "next/link";

// Supabase에서 가져올 데이터의 타입 정의
type ExtraLink = { name: string; url: string };
type ArchiveItem = {
  id: string;
  category: string;
  product_name: string;
  comment: string;
  price_info: string;
  thumbnail_url: string;
  link_coupang: string;
  link_naver: string;
  extra_links: ExtraLink[];
};

export default async function Home() {
  // 1. Supabase에서 데이터 가져오기 (최신 등록순)
  const { data: items, error } = await supabase
    .from("archives")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-4 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 2. 가져온 데이터를 카테고리별로 그룹화하기 (reduce 활용)
  const groupedItems = items?.reduce((acc: Record<string, ArchiveItem[]>, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-16">
      {/* 등록된 데이터가 없을 경우 보여줄 화면 */}
      {Object.keys(groupedItems).length === 0 && (
        <div className="text-center py-20 text-gray-500">
          아직 등록된 종결템이 없습니다.
        </div>
      )}

      {/* 카테고리별로 순회하며 렌더링 */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <section key={category}>
          {/* 카테고리 타이틀 */}
          <div className="mb-6 pb-2 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
          </div>

          {/* 상품 카드 그리드 (반응형: 모바일 1열, 태블릿 2열, PC 3열) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categoryItems.map((item) => (
    <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      
      {/* 1. 상세 페이지로 이동하는 구역 (이미지 + 텍스트) */}
      <Link href={`/item/${item.id}`} className="group flex-1 flex flex-col">
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          {item.thumbnail_url ? (
            <img 
              src={item.thumbnail_url} 
              alt={item.product_name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.product_name}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            "{item.comment}"
          </p>
          {item.price_info && (
             <div className="mt-4">
               <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md font-medium">
                 {item.price_info}
               </span>
             </div>
          )}
        </div>
      </Link>

      {/* 2. 외부 링크 버튼 구역 (Link 태그 밖으로 분리) */}
      <div className="px-5 pb-5 mt-auto flex flex-wrap gap-2">
        {item.link_coupang && (
          <a href={item.link_coupang} target="_blank" rel="noreferrer" className="flex-1 min-w-[45%] text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded transition-colors">
            🛒 쿠팡
          </a>
        )}
        {item.link_naver && (
          <a href={item.link_naver} target="_blank" rel="noreferrer" className="flex-1 min-w-[45%] text-center bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded transition-colors">
            🟢 네이버
          </a>
        )}
        {item.extra_links?.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noreferrer" className="flex-1 min-w-[45%] text-center bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2 rounded transition-colors">
            {link.name}
          </a>
        ))}
      </div>
      
    </div>
  ))}
</div>
        </section>
      ))}
    </div>
  );
}