import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default async function PortfolioSingle({ params }) {
  const supabase = createClient();
  const { id } = await params;

  const { data: current, error } = await supabase
    .from("portfolio")
    .select("*, portfolio_images(id, image_url, description, display_order)")
    .eq("id", id)
    .order("display_order", { referencedTable: "portfolio_images", ascending: true })
    .single();
  if (error) {
    console.error(error);
  }

  // 이전 글 조회
  const { data: prev } = await supabase
    .from("portfolio")
    .select()
    .lt("id", id)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 다음 글 조회
  const { data: next } = await supabase
    .from("portfolio")
    .select()
    .gt("id", id)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const portfolioImages = current.portfolio_images ?? [];

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
    <div className="portoflio-single">
      <div className="row">
        <div className="col-md-8 decription">
          {portfolioImages.length > 0 ? (
            portfolioImages.map((image, idx) => (
              <div key={idx} className="contents shadow">
                <Image
                  src={getPublicUrl(image.image_url)}
                  alt={image.description}
                  width={762}
                  height={504}
                  style={{ width: "100%", height: "auto" }}
                  loading="eager"
                />
                <p>{image.description}</p>
              </div>
            ))
          ) : (
            <div className="contents shadow">"대표 이미지가 없습니다."</div>
          )}
        </div>
        <div className="col-md-4 portfolio_info">
          <div className="contents shadow">
            <h2>{current?.title ?? "Title"}</h2>
            <div>{current?.content ?? "Description"}</div>
            <p className="link">
              <a href={current?.url ?? ""}>Visit site &rarr;</a>
            </p>
            <hr className="double" />
            <blockquote>
              <p>{current?.review ?? ""}</p>
              <small>{current?.reviewer ? `- ${current.reviewer} -` : ""}</small>
            </blockquote>
            <p className="nav">
              {prev ? (
                <a href={`/portfolio/${prev.id}`} className="secondary-btn">
                  &larr; {prev.title}
                </a>
              ) : (
                <button className="secondary-btn" disabled>
                  처음 글입니다.
                </button>
              )}
              {next ? (
                <a href={`/portfolio/${next.id}`} className="secondary-btn">
                  {next.title} &rarr;
                </a>
              ) : (
                <button className="secondary-btn" disabled>
                  마지막 글입니다.
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
