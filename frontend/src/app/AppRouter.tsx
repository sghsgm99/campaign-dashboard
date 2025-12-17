import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

import OverviewPage from "./pages/OverviewPage";
import CampaignsPage from "./pages/CampaignsPage";
import AdgroupsPage from "./pages/AdgroupsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CreateAdgroupPage from "./pages/CreateAdgroupPage";
import CreateAdPage from "./pages/CreateAdPage";
import CreateNegativeKeywordPage from "./pages/CreateNegativeKeywordPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />

        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/adgroups" element={<AdgroupsPage />} />

        <Route path="/create/campaign" element={<CreateCampaignPage />} />
        <Route path="/create/adgroup" element={<CreateAdgroupPage />} />
        <Route path="/create/ad" element={<CreateAdPage />} />
        <Route path="/create/negative-keyword" element={<CreateNegativeKeywordPage />} />
      </Route>
    </Routes>
  );
}
