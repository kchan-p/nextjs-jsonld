/**
 * カテゴリ一記事一覧ページ
 */
import { getCategories } from "@/lib/data";
import { CategoryPage, getProps , generateMetadata as gMetadata} from "@/components/categorypage";
import type { Props } from "@/components/categorypage";

export async function generateStaticParams() {
  const categorys = await getCategories();

  return categorys.map(c => ({
    category: c.id,
  }));
}

// メタデータの生成
export async function generateMetadata( props:Props) {
    const page = await getProps(props);
    return gMetadata(page);
}
/**
 * ページ生成
 */
export default async function Page(props:Props) {
    const p = await getProps(props);
    return CategoryPage(p);
}