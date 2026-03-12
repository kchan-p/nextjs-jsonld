/**
 * カテゴリ一記事一覧ページ
 */
import { notFound } from "next/navigation";
import { getSiteData, getCategorys, getCategory,getCategoryPosts } from "@/lib/data";
import { JsonLd,createCollectionPageLD,createBreadcrumbLD,createItemListLD } from "@/lib/jsonld";
import Link from "next/link";
import { stripHtmlTags,purify } from "@/lib/purify";


type Params = Promise<{ slug: string }>;

const getCategoryData = async (params: Params) => {
  const { slug } = await params;

  const cat = await getCategory(slug);
  if (!cat) notFound();

  return cat;
};

export async function generateStaticParams() {
  const categorys = await getCategorys();

  return categorys.map(c => ({
    slug: c.id,
  }));
}

// メタデータの生成
export async function generateMetadata({ params }: { params: Params }) {
  const cat = await getCategoryData(params);
  const name = stripHtmlTags(cat.name);

  return {
    title: `カテゴリ[${name}]の記事一覧`,
    description: `カテゴリ[${name}]の記事一覧です`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const siteData = await getSiteData();
  const cat = await getCategoryData(params);
  const posts = await getCategoryPosts(cat.id);

  const catUrl = `${siteData.url}/category/${cat.id}`;
  const postUrl = `${siteData.url}/posts`;

  const catName = `カテゴリ[${cat.name}]の記事一覧`;

  const collectionJsonLd = await createCollectionPageLD(catName,catUrl);

  const itemListJsonLd = await createItemListLD(
    posts.map(c => ({ name: c.title, url: `${postUrl}/${c.id}` }))
  );

  const breadcrumbJsonLd = await createBreadcrumbLD(
    [
      { name:"category" , item: `${siteData.url}/category` },
      { name:catName , item: catUrl }
    ]
  );

  return (<>
    <JsonLd ldObj={collectionJsonLd} />
    <JsonLd ldObj={itemListJsonLd} />
    <JsonLd ldObj={breadcrumbJsonLd} />

    <div>
      <h1>{stripHtmlTags(catName)}</h1>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <Link href={`/posts/${p.id}`}>
              {stripHtmlTags(p.title)}
            </Link>:{purify( p.content )}
          </li>
        ))}
      </ul>
    </div>
  </>);
}