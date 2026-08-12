import { createClient } from "@/utils/supabase/client";

import Image from "next/image";
import Link from "next/link";

export default function Home({ data }) {
  const supabase = createClient();

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
    <div className="latest_portfolio">
      <div className="row intro">
        <div className="col-md-4">
          <div className="contents shadow">
            <h2 className="heading2">I&apos;m Rozer4Heros</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="contents shadow">
            <h2 className="heading2">I create super awesome stuff</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="contents shadow">
            <h2 className="heading2">I&apos;m available for freelance projects</h2>
          </div>
        </div>
      </div>
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
      <p className="porfolio_readmore">
        <Link href="/portfolio" className="primary-btn">
          See my full portfolio
        </Link>
      </p>
    </div>
  );
}
