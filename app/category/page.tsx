/**
 * カテゴリ一覧ページ
 */
import { getSiteData, getCategorys } from "@/lib/data";
import { JsonLd, createCollectionPageLD,createBreadcrumbLD, createItemListLD } from "@/lib/jsonld";
import Link from "next/link";
import { stripHtmlTags } from "@/lib/purify";

export const metadata = {
  title: "カテゴリ一覧",
  description: "カテゴリ一覧です",
};

export default async function Page() {
  const siteData = await getSiteData();
  const categorys = await getCategorys();

  const url = `${siteData.url}/category`;

  const collectionJsonLd = await createCollectionPageLD("カテゴリ一覧",url);

  const itemListJsonLd = await createItemListLD(
    categorys.map(c => ({ name: c.name, url: `${url}/${c.id}` }))
  );
  const breadcrumbJsonLd = await createBreadcrumbLD(
    [{ name: "category", item: url }]
  );

  return (<>
    <JsonLd ldObj={collectionJsonLd} />
    <JsonLd ldObj={itemListJsonLd} />
    <JsonLd ldObj={breadcrumbJsonLd} />

    <div>
      <h1>カテゴリ一覧</h1>
      <ul>
        {categorys.map(c => (
          <li key={c.id}>
            <Link href={`/category/${c.id}`}>
              {stripHtmlTags(c.name)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>);
}