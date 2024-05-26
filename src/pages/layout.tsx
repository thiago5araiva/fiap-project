import { Outlet } from "react-router-dom";
import Logo from "@/assets/logo.svg";

export default function LayoutPage() {
  return (
    <main className="h-screen container mx-auto max-w-screen-xl relative">
      <div className="navigation flex items-center justify-between gap-6 py-6">
        <img src={Logo} alt="logo" />
        <div className="flex gap-10">
          <span>Dashboard</span>
          <span>Configurações</span>
        </div>
      </div>
      <Outlet />
    </main>
  );
}
