import { useEffect, useState } from "react";
import { Filter, RefreshCw, TrendingUp, ClipboardCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { getStoredOrders, updateOrderStatus, Order } from "@/data/storage";
import { toast } from "sonner";

const STATUS_FILTERS = ["All", "Pending", "Preparing", "Ready", "Completed"] as const;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const loadOrders = () => setOrders(getStoredOrders());

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
    toast.success(`Order updated to ${newStatus}`);
  };

  const filtered = statusFilter === "All" ? orders : orders.filter(o => o.status === statusFilter);

  const pending = orders.filter(o => o.status === "Pending").length;
  const ready = orders.filter(o => o.status === "Ready").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Order Queue</h1>
          <button onClick={loadOrders} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center btn-press hover:bg-border transition">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-4">Manage live student orders. Auto-refreshes every 4s.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 card-shadow border border-border">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-2">
              <ClipboardCheck className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">Awaiting Prep</p>
            <p className="text-2xl font-extrabold text-foreground">{pending.toString().padStart(2, "0")}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 card-shadow border border-border">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Ready for Pickup</p>
            <p className="text-2xl font-extrabold text-foreground">{ready.toString().padStart(2, "0")}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap btn-press transition-colors ${statusFilter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border border-border">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-muted-foreground font-medium">No orders found</p>
            {orders.length === 0 && <p className="text-sm text-muted-foreground mt-1">Students haven't placed any orders yet</p>}
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {filtered.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl p-4 card-shadow animate-fade-in border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{order.student}</p>
                    <p className="text-xs text-muted-foreground">{order.items}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{order.date}</p>
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
                      <button onClick={() => handleStatusUpdate(order.id, "Preparing")} className="flex-1 h-9 rounded-lg bg-blue-500/15 text-blue-400 font-semibold text-xs btn-press hover:bg-blue-500/25 transition">▶ Start Preparing</button>
                    )}
                    {order.status === "Preparing" && (
                      <button onClick={() => handleStatusUpdate(order.id, "Ready")} className="flex-1 h-9 rounded-lg bg-primary/15 text-primary font-semibold text-xs btn-press hover:bg-primary/25 transition">✓ Mark Ready</button>
                    )}
                    {order.status === "Ready" && (
                      <button onClick={() => handleStatusUpdate(order.id, "Completed")} className="flex-1 h-9 rounded-lg bg-green-500/15 text-green-500 font-semibold text-xs btn-press hover:bg-green-500/25 transition">✅ Complete</button>
                    )}
                    {(order.status === "Pending" || order.status === "Preparing" || order.status === "Ready") && (
                      <button onClick={() => handleStatusUpdate(order.id, "Completed")} className="px-3 h-9 rounded-lg bg-muted text-muted-foreground font-semibold text-xs btn-press hover:bg-border transition">Skip</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminOrdersPage;
