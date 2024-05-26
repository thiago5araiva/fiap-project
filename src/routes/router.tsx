import NoMatch from "@/pages/NoMatch";
import Home from "@/pages/home";
import Layout from "@/pages/layout";
import Scans from "@/pages/scans";

import { Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/scans/:id" element={<Scans />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}
