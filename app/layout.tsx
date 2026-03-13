import { getSiteData } from "@/lib/data";
import {stripHtmlTags} from "@/lib/purify";
import Link from "next/link";
import "./globals.css";

  // メタデータの生成
export async function generateMetadata() {
  const siteData = await getSiteData();
  const title = stripHtmlTags(siteData.title);

  return {
    metadataBase:new URL(siteData.url),
    title: {
      default: title,
      template: `%s | ${title}`
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteData = await getSiteData();
  const title = stripHtmlTags(siteData.title);

  return (
    <html lang="ja">
      <body>
        <header>
          <p><Link href={siteData.url}>{title}</Link></p>
        </header>
        <main>
        {children}
        </main>
        <footer>
          <p><Link href={siteData.url}>{title}</Link></p>
        </footer>
      </body>
    </html>
  );
}
