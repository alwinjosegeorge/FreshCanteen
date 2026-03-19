import { useState } from "react";
import { Filter, RefreshCw, TrendingUp, ClipboardCheck, CheckCircle2, Menu } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";

const orders = [
  { id: "#401", student: "Sarah Chen", items: "Avocado Bowl, Smoothie", token: "401", status: "Pending", total: "$18.50" },
  { id: "#402", student: "Mike Johnson", items: "Chicken Wrap, Lemonade", token: "402", status: "Preparing", total: "$12.75" },
  { id: "#403", student: "Emma Wilson", items: "Falafel Plate", token: "403", status: "Ready", total: "$12.00" },
  { id: "#404", student: "James Lee", items: "Margherita, Green Smoothie", token: "404", status: "Completed", total: "$11.00" },
  { id: "#405", student: "Ava Martinez", items: "Quinoa Flatbread, Mango Smoothie", token: "405", status: "Pending", total: "$14.25" },
];

const AdminOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>

        <div className="bg-primary rounded-2xl p-5 mt-4 mb-4 text-primary-foreground">
          <p className="text-sm opacity-90">Daily Performance</p>
          <p className="text-4xl font-extrabold">128 Orders</p>
          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/20 text-sm">
            <TrendingUp className="w-3.5 h-3.5" /> 12% from yesterday
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 card-shadow">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-2">
              <ClipboardCheck className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">Awaiting Prep</p>
            <p className="text-2xl font-extrabold text-foreground">14</p>
          </div>
          <div className="bg-card rounded-2xl p-4 card-shadow">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Ready for Pickup</p>
            <p className="text-2xl font-extrabold text-foreground">08</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Current Active Orders</h2>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setStatusFilter(null)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium btn-press transition-colors ${!statusFilter ? "bg-muted text-foreground" : "bg-card border border-border text-muted-foreground"}`}
          >
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold btn-press">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-card rounded-2xl p-4 card-shadow animate-fade-in">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-foreground">{order.student}</p>
                  <p className="text-xs text-muted-foreground">{order.items}</p>
                </div>
                <span className="text-sm font-bold text-primary bg-accent px-2 py-0.5 rounded-lg">{order.token}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <StatusBadge status={order.status} />
                <span className="font-bold text-foreground text-sm">{order.total}</span>
              </div>
              {order.status !== "Completed" && (
                <div className="flex gap-2 mt-3">
                  {order.status === "Pending" && (
                    <button className="flex-1 h-9 rounded-lg bg-warning/15 text-warning-foreground font-semibold text-xs btn-press">Mark Preparing</button>
                  )}
                  {order.status === "Preparing" && (
                    <button className="flex-1 h-9 rounded-lg bg-accent text-accent-foreground font-semibold text-xs btn-press">Mark Ready</button>
                  )}
                  {order.status === "Ready" && (
                    <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground font-semibold text-xs btn-press">Mark Completed</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminOrdersPage;
