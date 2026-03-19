import { CheckCircle2, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const OrderSuccessPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const token = "#042";
  const orderItems = [...items]; // snapshot before clear

  useEffect(() => {
    // Clear cart after placing order
    const timer = setTimeout(() => clearCart(), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader />
      <div className="px-4 pt-8 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4 animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm mb-8">Your order is being prepared!</p>

        <div className="bg-card rounded-2xl p-8 card-shadow mb-6 animate-slide-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Order Token</p>
          <p className="text-6xl font-extrabold text-foreground">{token}</p>
          <div className="mt-4"><StatusBadge status="Preparing" /></div>
        </div>

        <div className="bg-card rounded-2xl p-6 card-shadow mb-6 text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="w-40 h-40 mx-auto bg-muted rounded-xl flex items-center justify-center mb-3">
            <div className="text-4xl">📱</div>
          </div>
          <p className="text-sm text-muted-foreground">Scan this QR at the pickup counter when your status changes to "Ready"</p>
        </div>

        <div className="bg-card rounded-2xl p-5 card-shadow text-left animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div>
                <p className="font-medium text-foreground text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.tags.join(" • ")} × {item.quantity}</p>
              </div>
              <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border mt-3 pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total Paid</span>
            <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <Link to="/order-status" className="mt-6 flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold btn-press hover:opacity-90 transition">
          View Live Queue
        </Link>
        <Link to="/menu" className="mt-3 flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
