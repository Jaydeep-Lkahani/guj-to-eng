// Used only at build time: renders a page to HTML so search engines get the full lesson text.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./App";

export { allPaths, headTags, indexablePaths, pageMeta, SITE_URL, url } from "./seo";

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}
