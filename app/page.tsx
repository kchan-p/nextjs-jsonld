/**
 * トップページ
 */
import { TopPage , generateMetadata as gMetadata } from "@/components/toppage";

// メタデータの生成
export async function generateMetadata() {
  return await gMetadata();
}

export default async function Page() {
  return await TopPage();
}
