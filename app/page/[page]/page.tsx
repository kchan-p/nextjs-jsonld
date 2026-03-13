/**
 * トップページのページ実装
 */
import { TopPage , getProps,getPageNum,generateMetadata as gMetadata } from "@/components/toppage";
import type { Props } from "@/components/toppage";
import { permanentRedirect } from "next/navigation";

/**
 * ページURL解決
 *  ※ /page/1 は / にリダイレクトのため含まない
 */
export async function generateStaticParams() {
  const pnum = await getPageNum();

  return Array.from({ length: pnum - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}
/**
 * メタデータ生成
 */
export async function generateMetadata( props:Props) {
    const page = await getProps(props);
    if( page === 1 ){
        permanentRedirect("/");
    }
    return gMetadata(page);
}
/**
 * ページ生成
 */
export default async function Page(props:Props) {
    const page = await getProps(props);
    if( page === 1 ){
        permanentRedirect("/");
    }
    return TopPage(page);
}
