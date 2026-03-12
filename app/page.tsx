/**
 * トップページ
 */
import { getSiteData, getPosts, getCategory } from "@/lib/data";
import { stripHtmlTags } from "@/lib/purify";
import Link from "next/link";
import { JsonLd,createWebSiteLD,createItemListLD ,createPersonLD} from "@/lib/jsonld";
import { Pager } from "@/lib/pager";

// メタデータの生成
export async function generateMetadata() {
  const siteData = await getSiteData();

  return {
    title: stripHtmlTags(siteData.title),
    description: stripHtmlTags(siteData.description).slice(0, 120),
  };
}
type Props = {
  searchParams: Promise<{ page?: string }>
}
const ITEMS_PER_PAGE = 3;

export default async function Home({ searchParams }: Props) {
  const p = Number((await searchParams)?.page);
  const page = isNaN(p) ? 0 : p - 1;

  const siteData = await getSiteData();
  const posts = await getPosts();

  const websiteJsonLd = await createWebSiteLD(siteData.title,siteData.url);
  const personJsonLd = await createPersonLD(siteData.person,siteData.url);

  const start = page * ITEMS_PER_PAGE;
  const displayPosts = posts.slice( start , start + ITEMS_PER_PAGE );

  const postUrl = `${siteData.url}/posts`;
  const itemListJsonLd = await createItemListLD(
    displayPosts.map(c => ({ name: c.title, url: `${postUrl}/${c.id}` }))
  ,start);

  const items = await Promise.all(
    displayPosts.map(async (post) => {
      const cat = await getCategory(post.category);
      return (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`}>
            {stripHtmlTags(post.title)}
          </Link>( {cat ? cat.name : ""} )-更新日：{post.updatedAt}
        </li>
      )
    }
    )
  );

  return (<>
    <JsonLd ldObj={websiteJsonLd} />
    <JsonLd ldObj={personJsonLd} />
    <JsonLd ldObj={itemListJsonLd} />

    <div>
      <Link href="/category/">カテゴリ一覧</Link>
    </div>
    <h1>記事一覧</h1>
    <div>
      <ul>
        {items}
      </ul>
      <Pager itemNum={posts.length} perPage={ITEMS_PER_PAGE} currentPage={page+1} />
    </div>
  </>
  );
}
