import { UtensilsCrossed, ClipboardList, User, ScanLine, Users, Settings, LayoutDashboard, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const studentTabs = [
  { icon: UtensilsCrossed, label: "Menu", path: "/menu" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: ClipboardList, label: "Orders", path: "/order-status" },
  { icon: User, label: "Profile", path: "/profile" },
];

const adminTabs = [
  { icon: LayoutDashboard, label: "Stats", path: "/admin" },
  { icon: ClipboardList, label: "Orders", path: "/admin/orders" },
  { icon: ScanLine, label: "Scan", path: "/admin/scanner" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Settings, label: "Config", path: "/admin/settings" },
];

export const BottomNav = ({ variant = "student" }: { variant?: "student" | "admin" }) => {
  const location = useLocation();
  const { totalItems } = useCart();
  const tabs = variant === "admin" ? adminTabs : studentTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path || location.pathname.startsWith(tab.path + "/");
          return (
            <Link
              key={tab.path + tab.label}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px] transition-colors relative ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              {active && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary" />}
              <tab.icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{tab.label}</span>
              {tab.label === "Cart" && totalItems > 0 && (
                <span className="absolute -top-0.5 right-2 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
