import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { PartPage } from "./pages/PartPage";
import { TopicPage } from "./pages/TopicPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Clean URLs (/topic/p1-t01) so search engines see every lesson as its own page.
// The build writes one HTML file per page (scripts/prerender.mjs), so any static host works.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="part/:partId" element={<PartPage />} />
        <Route path="topic/:topicId" element={<TopicPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
