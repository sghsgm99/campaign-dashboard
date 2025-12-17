import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Google Ads Manager
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage your advertising campaigns
          </p>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
