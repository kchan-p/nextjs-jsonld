/**
 * カテゴリ一記事一覧ページ
 */
import { notFound } from "next/navigation";
import { getSiteData, getCategory, getCategoryPosts } from "@/lib/data";
import { JsonLd, createCollectionPageLD, createBreadcrumbLD, createItemListLD } from "@/components/jsonld";
import Link from "next/link";
import { stripHtmlTags, purify, sanitizeSlug } from "@/lib/purify";
import { Pager } from "@/components/pager";

const ITEMS_PER_PAGE = 5;

export type Props = {
    params: Promise<{category?:string,page?:string}>
}
interface PropItem {
    category: string;
    page: number;
}
/**
 * URLからカテゴリ名とページ番号取得
 */
async function getProps({ params }: Props):Promise<PropItem> {
    const prm = await params;
    const category = prm.category;
    if (!category || !sanitizeSlug(category)) {
        notFound();
    }
    const page: number = prm.page === undefined ? 1 : Number(prm.page);

    if (!Number.isInteger(page) || page < 1) notFound();
    return { category, page };
}
/**
 * カテゴリデータの取得
 */
async function getCategoryData(category: string) {

    const cat = await getCategory(category);
    if (!cat) notFound();

    return cat;
};

/**
 * カテゴリページ数取得
 */
async function getCtagoryPageNum(category: string) {
    const posts = await getCategoryPosts(category);
    if (!posts) return 1;

    return Math.floor(posts.length / ITEMS_PER_PAGE) + 1;
}
// メタデータの生成
export async function generateMetadata({ category, page }: PropItem) {
    const catName = (await getCategoryData(category)).name;

    const path = `/category/${catName}${page === 1 ? "" : `/page/${page}`}`;
    const pageText = page === 1 ? "" : `-Page${page}`;

    return {
        title: `カテゴリ[${catName}]の記事一覧${pageText}`,
        description: `カテゴリ[${catName}]の記事一覧です`,
        alternates: {
            canonical: path,
        }
    };
}

async function CategoryPage({ category, page  }: PropItem) {
    const siteData = await getSiteData();
    const cat = await getCategoryData(category);
    const posts = await getCategoryPosts(category);
    const pnum = await getCtagoryPageNum(category);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const displayPosts = posts.slice(start, start + ITEMS_PER_PAGE);

    const catUrl = `${siteData.url}/category/${category}/`;
    const postUrl = `${siteData.url}/posts`;

    const catName = `カテゴリ[${cat.name}]の記事一覧`;

    const collectionJsonLd = await createCollectionPageLD(catName, catUrl);

    const itemListJsonLd = await createItemListLD(
        displayPosts.map(c => ({ name: c.title, url: `${postUrl}/${c.id}` }))
        , start);

    const breadcrumbJsonLd = await createBreadcrumbLD(
        [
            { name: "category", item: `${siteData.url}/category` },
            { name: catName, item: catUrl }
        ]
    );

    return (<>
        <JsonLd ldObj={collectionJsonLd} />
        <JsonLd ldObj={itemListJsonLd} />
        <JsonLd ldObj={breadcrumbJsonLd} />

        <div>
            <h1>{stripHtmlTags(catName)}</h1>
            <ul>
                {displayPosts.map(p => (
                    <li key={p.id}>
                        <Link href={`/posts/${p.id}`}>
                            {stripHtmlTags(p.title)}
                        </Link>:{purify(p.content)}
                    </li>
                ))}
            </ul>
            <Pager pageNum={pnum} currentPage={page} basePath={catUrl} />
        </div>
    </>);
}

export { CategoryPage, getProps, getCategoryData, getCtagoryPageNum };