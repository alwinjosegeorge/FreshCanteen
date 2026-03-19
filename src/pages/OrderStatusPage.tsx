import { useEffect, useState } from "react";
import { CheckCircle2, UtensilsCrossed, Bell, ClipboardCheck, Clock, RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getStoredOrders, getSession, Order, estimateWait } from "@/data/storage";
import { Link } from "react-router-dom";

const steps = [
  { label: "Pending", icon: CheckCircle2, desc: "Order received by kitchen" },
  { label: "Preparing", icon: UtensilsCrossed, desc: "Your food is being prepared" },
  { label: "Ready", icon: Bell, desc: "Ready for pickup at counter" },
  { label: "Completed", icon: ClipboardCheck, desc: "Order collected — enjoy!" },
];

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [waitTime, setWaitTime] = useState(0);

  const loadOrders = () => {
    const session = getSession();
    if (!session) return;
    const all = getStoredOrders().filter(o => o.studentEmail === session.email);
    setOrders(all);
    setWaitTime(estimateWait());
    if (all.length > 0 && !selectedOrder) setSelectedOrder(all[0]);
    else if (selectedOrder) {
      const updated = all.find(o => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (stepLabel: string) => {
    if (!selectedOrder) return { done: false, active: false };
    const statuses = ["Pending", "Preparing", "Ready", "Completed"];
    const currentIdx = statuses.indexOf(selectedOrder.status);
    const stepIdx = statuses.indexOf(stepLabel);
    return { done: stepIdx < currentIdx, active: stepIdx === currentIdx };
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <p className="text-5xl mb-4">📜</p>
          <h2 className="text-xl font-bold text-foreground mb-2">No Active Orders</h2>
          <p className="text-muted-foreground text-sm mb-6">You haven't placed any orders yet.</p>
          <Link to="/menu" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold btn-press">Browse Menu</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Track Your Meal</h1>
          <button onClick={loadOrders} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center btn-press hover:bg-border transition">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-muted-foreground text-sm">Auto-refreshes every 3 seconds</p>
          {waitTime > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-card border border-border rounded-full px-3 py-1">
              <Clock className="w-3 h-3" /> ~{waitTime} min wait
            </div>
          )}
        </div>

        {/* Order Selector */}
        {orders.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {orders.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap btn-press transition-colors ${selectedOrder?.id === o.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}
              >
                {o.token}
              </button>
            ))}
          </div>
        )}

        {selectedOrder && (
          <>
            {/* Status Header */}
            <div className={`rounded-2xl p-4 mb-4 flex items-center gap-3 ${selectedOrder.status === "Ready" ? "bg-primary/10 border border-primary/30" : selectedOrder.status === "Completed" ? "bg-green-500/10 border border-green-500/30" : "bg-card border border-border"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOrder.status === "Ready" ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}>
                {selectedOrder.status === "Ready" ? <Bell className="w-5 h-5" /> : selectedOrder.status === "Completed" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Token {selectedOrder.token}</p>
                <p className="text-xs text-muted-foreground">Placed at {selectedOrder.timestamp} • {selectedOrder.total}</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-card rounded-2xl p-6 card-shadow mb-4 animate-fade-in">
              <div className="space-y-0">
                {steps.map((step, i) => {
                  const { done, active } = getStepStatus(step.label);
                  return (
                    <div key={step.label} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        {i < steps.length - 1 && <div className={`w-0.5 h-8 my-1 ${done ? "bg-primary" : "bg-border"}`} />}
                      </div>
                      <div className="pt-2">
                        <p className={`font-semibold text-sm ${done || active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                        <p className={`text-xs ${active ? "text-primary font-bold uppercase tracking-widest" : "text-muted-foreground"}`}>{active ? "In Progress" : step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-card rounded-2xl p-4 border border-border mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Order Items</p>
              <p className="text-sm text-foreground font-medium leading-relaxed">{selectedOrder.items}</p>
            </div>

            <div className="bg-card rounded-2xl p-5 card-shadow border border-border mb-4">
              <div className="flex justify-between items-center">
                <span className="font-extrabold tracking-tight text-lg">Total Paid</span>
                <span className="font-extrabold text-primary tracking-tight text-lg">{selectedOrder.total}</span>
              </div>
            </div>

            {selectedOrder.status === "Ready" && (
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-bold text-foreground text-sm">Your meal is ready!</p>
                  <p className="text-xs text-muted-foreground">Please head to the counter and show your token {selectedOrder.token}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderStatusPage;
