import { createClient } from "@/utils/supabase/client";

import Image from "next/image";
import Link from "next/link";

export default async function Portfolio({ searchParams }) {
  const params = await searchParams;
  const PAGE_SIZE = 6;
  const PAGE_GROUP_SIZE = 5;

  const supabase = createClient();

  // Portfolio테이블 데이터 총 개수
  const { count: portfolioCount, error: countError } = await supabase
    .from("portfolio")
    .select("*", { count: "exact", head: true });
  if (countError) {
    console.error("Connection failed: ", countError);
    return <div>{countError.message}</div>;
  }

  // 페이지네이션 링크 생성
  const pageCount = Math.ceil(portfolioCount / PAGE_SIZE);
  const pageCurrent = Math.min(!!Number(params.page) ? Number(params.page) : 1, pageCount);

  // 링크 클릭 시
  const from = PAGE_SIZE * (pageCurrent - 1);
  const to = PAGE_SIZE * pageCurrent - 1;
  const { data, error } = await supabase
    .from("portfolio")
    .select()
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Connection failed: ", error);
    return <div>Failed to load projects</div>;
  }

  // 페이지 그룹 계산
  const pageGroupCurrent = Math.ceil(pageCurrent / PAGE_GROUP_SIZE);
  const pageGroupCount = Math.ceil(pageCount / PAGE_GROUP_SIZE);
  const pageGroupStart = (pageGroupCurrent - 1) * PAGE_GROUP_SIZE + 1;
  const pageGroupEnd = Math.min(pageGroupCurrent * PAGE_GROUP_SIZE, pageCount);

  const pageCountArray = [];
  for (let i = pageGroupStart; i <= pageGroupEnd; i++) {
    pageCountArray.push(i);
  }
  const pagePrevGroup = pageGroupStart - 1;
  const pageNextGroup = pageGroupCurrent * PAGE_GROUP_SIZE + 1;

  const getPublicUrl = path => {
    if (!path) return null;
    const { data: publicUrlData, error } = supabase.storage.from("portfolio").getPublicUrl(path);
    if (error) {
      console.warn("Failed to load " + path);
      return null;
    }
    return publicUrlData.publicUrl;
  };

  return (
    <>
      <div className="latest_portfolio">
        <div className="row list">
          {data.map(item => (
            <div key={item.id} className="col-md-4">
              <div className="contents shadow">
                {item.thumbnail && (
                  <div style={{ height: 209 }}>
                    <Image
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      src={getPublicUrl(item.thumbnail)}
                      width={364}
                      height={209}
                      alt={item.title}
                      loading="eager"
                    />
                  </div>
                )}
                <div className="hover_contents">
                  <div className="list_info">
                    <h3>
                      <Link href={`/portfolio/${item.id}`}>{item.title}</Link>
                      <Image src="/images/portfolio_list_arrow.png" width={6} height={8} alt="list arrow" />
                    </h3>
                    <p>
                      <Link href={`/portfolio/${item.id}`}>Click to see project</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagenation shadow">
        {pageGroupCurrent > 1 && (
          <Link href={`?page=${pagePrevGroup}`} className="secondary-btn">
            &larr;
          </Link>
        )}
        {pageCountArray.map(i => (
          <Link key={i} href={`?page=${i}`} className={`secondary-btn ${pageCurrent === i ? "active" : ""}`}>
            {i}
          </Link>
        ))}
        {pageGroupCurrent < pageGroupCount && (
          <Link href={`?page=${pageNextGroup}`} className="secondary-btn">
            &rarr;
          </Link>
        )}
      </div>
    </>
  );
}
