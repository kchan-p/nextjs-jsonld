import DOMPurify from "isomorphic-dompurify"

function purify(html:string) {
    if( !html ) return "";
    
    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
            "p", "br", "strong", "em", "ul", "ol", "li",
            "a", "h1", "h2", "h3", "h4","h5","blockquote"
        ],
        ALLOWED_ATTR: ["href", "target", "rel"]
    })
}
function stripHtmlTags(html:string){
    if( !html ) return "";

    return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function escapeHtml<T>(str: T): T | string {
  if (typeof str !== "string") return str;

  const escape: Record<string, string> = {
    "&": "&amp;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
  };

  return str.replace(/[&"<>']/g, (match) => escape[match]);
}

function sanitizeSlug(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false;
  }
  return slug;
}
export {purify,stripHtmlTags,escapeHtml,sanitizeSlug};