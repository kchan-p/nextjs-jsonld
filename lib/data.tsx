/**
 * コンテンツデータの生成/取得
 */
type SiteData = {
    title: string,
    description: string,
    url: string,
    person: string,
};

type Category = {
    id: string
    name: string,
};
type Post = {
    id: string,
    title: string,
    category: string,
    description: string,
    content: string,
    publishedAt: string,
    updatedAt: string,
    image: string,
}

const siteData: SiteData = {
    title: "Next.jsでのJSON-LD出力デモ",
    description: "Next.jsでJSON-LDを出力するデモサイトです",
    url: process.env.NEXT_PUBLIC_SITE_URL!,
    person: "kchan"
};

const Uncategorized: Category = { id: "uncategorized", name: "未分類" };
const category: Category[] = [
    Uncategorized,
    { id: "life", name: "生活" },
    { id: "study", name: "勉強" }
];
const getUncategorized = () => Uncategorized;

async function getPostsData(){
    'use cache'
    
    const datas = [{ cat:category[1], count: 12 }, { cat:category[2], count: 4 }];
   
    return datas.reduce<[Post[],number]>( (r,v)=>{
        for (let count = 1; count <= v.count; count++,r[1]++) {
            const dt = [Math.floor(Math.random()*30)+1,Math.floor(Math.random()*30)+1];
            if(dt[0]>dt[1]) [dt[0],dt[1]]=[dt[1],dt[0]];
            const d = `4月${dt[0]}日`;
            const id = r[1];

            r[0].push(Object.freeze({
                id: `p${id}`,
                title: `${d}の日記(${v.cat.name})`,
                category: v.cat.id,
                description: `${d}の日記の記事(${v.cat.name})`,
                content: `今日は${d}です。これは(${v.cat.name})の記事です。`,
                publishedAt: `2026-04-${dt[0].toString().padStart(2,"0")}`,
                updatedAt: `2026-04-${dt[1].toString().padStart(2,"0")}`,
                image: `image${id}.png`
            }));
        }
        return r;
    },[[],1])[0];
}


// サイトデータの取得
async function getSiteData() {
    'use cache'
    return siteData;
}
// 全カテゴリーデータの取得
async function getCategorys() {
    'use cache'
    return category;
}
// カテゴリーデータの取得
async function getCategory(categoryId: string) {
    'use cache'
    return category.find(c => c.id === categoryId);
}
// 全記事データの取得/更新日降順
async function getPosts() {
    'use cache'
    return (await getPostsData()).toSorted((a,b)=>a.updatedAt>b.updatedAt?-1:1);
}
// 記事データの取得
async function getPost(postId: string) {
    'use cache'
    return (await getPostsData()).find(p => p.id === postId);
}
// カテゴリーに所属する記事データの取得
async function getCategoryPosts(categoryId: string) {
    'use cache'
    return (await getPostsData()).filter(p => p.category === categoryId);
}

export { getSiteData, getCategorys, getCategory, getPosts, getPost, getCategoryPosts, getUncategorized };
export type { SiteData, Category, Post };
