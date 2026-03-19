import { CheckCircle2, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Link, useLocation } from "react-router-dom";
import { Order, formatPrice } from "@/data/storage";
import type { CartItem } from "@/context/CartContext";

interface LocationState {
  order: Order;
  orderItems: CartItem[];
}

const OrderSuccessPage = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const order = state?.order;
  const orderItems = state?.orderItems || [];

  const totalPaid = orderItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader />
      <div className="px-4 pt-8 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4 animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">Order Successful!</h1>
        <p className="text-muted-foreground text-sm mb-8">Your request is sent to the FreshCanteen kitchen.</p>

        <div className="bg-card rounded-3xl p-8 card-shadow mb-6 border-2 border-primary/20 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary px-3 rounded-bl-xl">Pickup Token</div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Your Token Number</p>
          <p className="text-6xl font-black text-primary tracking-tighter">{order?.token || "#TK-???"}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
            Status: {order?.status || "Pending"}
          </div>
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="bg-card rounded-2xl p-5 card-shadow text-left animate-slide-up mb-4" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <div>
                  <p className="font-medium text-foreground text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.tags.join(" • ")} × {item.quantity}</p>
                </div>
                <span className="font-medium text-sm">{formatPrice(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border mt-3 pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total Paid</span>
              <span className="font-bold text-primary">{order?.total || formatPrice(totalPaid)}</span>
            </div>
          </div>
        )}

        <Link to="/order-status" className="mt-2 flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold btn-press hover:opacity-90 transition">
          🔴 View Live Tracking
        </Link>
        <Link to="/menu" className="mt-3 flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Order More
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
