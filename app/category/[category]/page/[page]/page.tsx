/**
 * カテゴリに所属する記事一覧ページのページ実装
 *  /category/[category]/page/[page]
 */
import { getCategories } from "@/lib/data";
import { CategoryPage, getProps, getCtagoryPageNum, generateMetadata as gMetadata } from "@/components/categorypage";
import type { Props } from "@/components/categorypage";
import { permanentRedirect } from "next/navigation";

/**
 * ページURL解決
 *  ※ /page/1 は / にリダイレクトのため含まない
 */
export async function generateStaticParams() {

    const categories = await getCategories();
    const params = [];

    for (const category of categories) {
        const pageNum = await getCtagoryPageNum(category.id);

        for (let page = 2; page <= pageNum; page++) {
            params.push({
                category: category.id,
                page: page.toString(),
            });
        }
    }
    return params;
}
/**
 * メタデータ生成
 */
export async function generateMetadata(props: Props) {
    const page = await getProps(props);
    return gMetadata(page);
}
/**
 * ページ生成
 */
export default async function Page(props: Props) {
    const p = await getProps(props);
    if (p.page === 1) {
        permanentRedirect(`/category/${p.category}`);
    }
    return CategoryPage(p);
}