/**
 * JSON-LD出力コンポーネント＆JSON-LDオブジェクトの生成
 */
import { getSiteData } from "@/lib/data";
import type {
  WithContext,
  CollectionPage,
  WebSite,
  Person,
  BreadcrumbList,
  Thing,
  ListItem,
  ItemList
} from "schema-dts"
import { escapeHtml } from "../lib/purify";


// JSON-LD出力コンポーネント
interface Props {
  ldObj: WithContext<Thing>;
}
function JsonLd({ ldObj }: Props) {
  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ldObj).replace(/</g, "\\u003c"),
      }}
    />
    <pre className="json"
      dangerouslySetInnerHTML={{
        __html: escapeHtml(JSON.stringify(ldObj).replace(/</g, "\\u003c")),
      }}
    />
  </>)
}



// @type": "ListItem の型定義
//  Breadcrumb向け
type ItemListItemOnly = {
  name: string
  item: string
  url?: never
}
// 記事一覧等向け
type ItemListUrlOnly = {
  name: string
  url: string
  item?: never
}

const SCHEMA_CONTEXT = "https://schema.org";

/**
 * JSON-LDオブジェクトの生成
 */
// @type: WebSite
async function createWebSiteLD(
  name: string,
  url: string
): Promise<WithContext<WebSite>> {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: name,
    url: url,
  }
}

/**
 * JSON-LDオブジェクトの生成
 */
// @type: Person
async function createPersonLD(
  name: string,
  url: string
): Promise<WithContext<Person>> {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    name: name,
    url: url,
  }
}

/**
 * JSON-LDオブジェクトの生成
 */
// @type: CollectionPage
async function createCollectionPageLD(
  name: string,
  url: string
): Promise<WithContext<CollectionPage>> {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "CollectionPage",
    name: name,
    url: url,
  }
}

// @type: BreadcrumbList
async function createBreadcrumbLD(
  listItems: ItemListItemOnly[]
): Promise<WithContext<BreadcrumbList>> {
  const siteData = await getSiteData();
  const items: ItemListItemOnly[] =
    [
      { name: "ホーム", item: siteData.url },
      ...listItems
    ];

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: createItemListElementLD(items)
  };
};

// @type: ItemList
async function createItemListLD(
  listItems: ItemListUrlOnly[],
  offset = 0
): Promise<WithContext<ItemList>> {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemList",
    itemListElement: createItemListElementLD(listItems, offset)
  };
}

// itemListElementの生成
function createItemListElementLD(
  listItems: (ItemListItemOnly | ItemListUrlOnly)[],
  offset = 0
): ListItem[] {

  return listItems.map((l, i) => {
    const item: ListItem = {
      "@type": "ListItem",
      position: i + 1 + offset,
      name: l.name,
    };
    if ("item" in l && l.item != null) {
      item.item = l.item
    }

    if ("url" in l && l.url != null) {
      item.url = l.url
    }

    return item;
  });
}


export { JsonLd, createWebSiteLD , createPersonLD, createCollectionPageLD, createBreadcrumbLD, createItemListLD }