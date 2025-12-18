import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Layers,
  PlusCircle,
  Ban,
  BarChart3
} from "lucide-react";

const navItem =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition";
const active =
  "bg-blue-600 text-white";
const inactive =
  "text-gray-600 hover:bg-gray-100";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r px-4 py-6">
      <div className="mb-8 px-4 text-lg font-bold text-gray-900">
        Ads Console
      </div>

      <nav className="space-y-6">
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Overview
          </p>

          <NavLink to="/overview" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <LayoutDashboard size={18} />
            Overview
          </NavLink>

          <NavLink to="/campaigns" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <Megaphone size={18} />
            Campaigns
          </NavLink>

          <NavLink to="/adgroups" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <Layers size={18} />
            Ad Groups
          </NavLink>

          <NavLink to="/ads" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <BarChart3 size={18} />
            Ads
          </NavLink>
        </div>

        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Create
          </p>

          <NavLink to="/create/campaign" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <PlusCircle size={18} />
            Campaign
          </NavLink>

          <NavLink to="/create/adgroup" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <PlusCircle size={18} />
            Ad Group
          </NavLink>

          <NavLink to="/create/ad" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <PlusCircle size={18} />
            Ad
          </NavLink>

          <NavLink to="/create/negative-keyword" className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }>
            <Ban size={18} />
            Negative Keywords
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
