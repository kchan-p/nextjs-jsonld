/**
 * 記事ページ
 */
import { notFound } from "next/navigation";
import { getSiteData, getCategory, getPosts, getPost, getUncategorized } from "@/lib/data";
import { JsonLd, createBreadcrumbLD } from "@/lib/jsonld";
import Link from "next/link";
import Image from 'next/image';
import { stripHtmlTags, purify } from "@/lib/purify";
import type {
  WithContext,
  BlogPosting,
} from "schema-dts"

type Params = Promise<{ slug: string }>;

const getData = async (params: Params) => {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) notFound();

  return post;
};

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map(p => ({
    slug: p.id,
  }));
}

// メタデータの生成
export async function generateMetadata({ params }: { params: Params }) {
  const post = await getData(params);

  return {
    title: stripHtmlTags(post.title),
    description: stripHtmlTags(post.description),
  };
}

export default async function Page({ params }: { params: Params }) {

  const siteData = await getSiteData();
  const post = await getData(params);
  const cat = await (async () => {
    const c = await getCategory(post.category);
    return c ? c : getUncategorized();
  })();

  const catUrl = `${siteData.url}/category/${cat.id}`;
  const postUrl = `${siteData.url}/posts/${post.id}`;
  const postImage = `${siteData.url}/image/${post.image}`;

  const blogPostingJsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: postImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    author: {
      "@type": "Person",
      name: siteData.person,
    },
    publisher: {
      "@type": "Person",
      name: siteData.person,
    },
  }

  const breadcrumbJsonLd = await createBreadcrumbLD(
    [
      { name: cat.name, item: catUrl },
      { name: post.title, item: postUrl }
    ]
  );


  return (<>
    <JsonLd ldObj={blogPostingJsonLd} />
    <JsonLd ldObj={breadcrumbJsonLd} />

    <div>
      <h1>{stripHtmlTags(post.title)}</h1>
      <p>カテゴリ:<Link href={catUrl}>{stripHtmlTags(cat.name)}</Link></p>
      <Image
        src={`/image/${post.image}`}
        alt={postImage}
        width={600}
        height={450}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: purify(post.content),
        }}
      />
    </div>
  </>);
}