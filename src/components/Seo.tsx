import { useEffect } from "react";
import { useLocation } from "react-router";
import { headTags, pageMeta } from "../seo";

// Keeps the page title, description, canonical link and structured data in step
// with the page she is on. The build writes the same tags into each page's HTML.
export function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = pageMeta(pathname);
    document.title = meta.title;
    document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    document.head.insertAdjacentHTML("beforeend", headTags(meta));
  }, [pathname]);
  return null;
}
