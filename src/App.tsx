import { HashRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { PartPage } from "./pages/PartPage";
import { TopicPage } from "./pages/TopicPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Hash URLs (#/topic/p1-t01) so the site works on any static host with no server setup.
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="part/:partId" element={<PartPage />} />
          <Route path="topic/:topicId" element={<TopicPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
