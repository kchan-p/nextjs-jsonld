/**
 * トップページ ページ分割対応共通コンポーネント
 */
import { notFound } from "next/navigation";
import { getSiteData, getPosts, getCategory } from "@/lib/data";
import { stripHtmlTags } from "@/lib/purify";
import Link from "next/link";
import { JsonLd, createWebSiteLD, createItemListLD, createPersonLD } from "@/components/jsonld";
import { Pager } from "@/components/pager";

const ITEMS_PER_PAGE = 5;

export type Props = {
    params: Promise<{ page?: string }>
}
/**
 * URLからページ番号取得
 */
async function getProps({ params }: Props) {
    const page = Number((await params).page);
    if (!Number.isInteger(page) || page < 1) notFound();
    return page;
}
/**
 * 総ページ数取得
 */
async function getPageNum() {
    const pnum = (await getPosts()).length;
    
    return Math.floor(pnum / ITEMS_PER_PAGE) + 1;
}

/**
 * メタデータ生成
 */
async function generateMetadata(page: number = 1) {
    const siteData = await getSiteData();
    const title = stripHtmlTags(siteData.title)
        + (page <= 1 ? "" : `-Page${page}`);

    return {
        title: title,
        description: stripHtmlTags(siteData.description).slice(0, 120),
        alternates: {
            canonical: page === 1 ? "/" : `/page/${page}`,
        }
    };
}

async function TopPage(page:number = 1) {

    const siteData = await getSiteData();
    const posts = await getPosts();
    const pnum = await getPageNum();

    const websiteJsonLd = await createWebSiteLD(siteData.title, siteData.url);
    const personJsonLd = await createPersonLD(siteData.person, siteData.url);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const displayPosts = posts.slice(start, start + ITEMS_PER_PAGE);

    const postUrl = `${siteData.url}/posts`;
    const itemListJsonLd = await createItemListLD(
        displayPosts.map(c => ({ name: c.title, url: `${postUrl}/${c.id}` }))
        , start);

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
            <Pager pageNum={pnum} currentPage={page} basePath="/" />
        </div>
    </>
    );
}

export { getProps , getPageNum, generateMetadata, TopPage };