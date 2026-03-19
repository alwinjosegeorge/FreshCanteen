import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ArrowRight, Trash2, ShoppingBag, Tag } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { saveOrder, getSession, generateToken, generateId, now, today, addPoints, getLoyalty, redeemPoints, pointsToDiscount } from "@/data/storage";
import { toast } from "sonner";

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  const [usePoints, setUsePoints] = useState(false);
  const navigate = useNavigate();
  const session = getSession();
  const loyalty = session ? getLoyalty(session.email) : { points: 0, totalEarned: 0, email: "" };

  const tax = totalPrice * 0.05;
  const pointsDiscount = usePoints && loyalty.points >= 100 ? pointsToDiscount(Math.min(loyalty.points, 500)) : 0;
  const total = Math.max(0, totalPrice + tax - pointsDiscount);
  const pointsEarned = Math.round(totalPrice * 10);

  const handleCheckout = () => {
    if (items.length === 0) { toast.error("Your cart is empty!"); return; }

    const token = generateToken();
    const order = {
      id: generateId(),
      student: session?.name || "Student",
      studentEmail: session?.email || "guest@freshcanteen.com",
      items: items.map(i => `${i.quantity}x ${i.name}`).join(", "),
      token,
      status: "Pending" as const,
      total: `$${total.toFixed(2)}`,
      totalNum: total,
      timestamp: now(),
      date: today(),
      rating: undefined,
    };

    saveOrder(order);

    // Points: earn for this order
    addPoints(session?.email || "guest", pointsEarned);
    // Points: deduct if redeemed
    if (usePoints && loyalty.points >= 100) {
      const toRedeem = Math.min(loyalty.points, 500);
      redeemPoints(session?.email || "guest", toRedeem);
    }

    clearCart();
    toast.success(`🎉 Order placed! +${pointsEarned} loyalty points earned!`);
    navigate("/order-success", { state: { order, orderItems: items } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-40" />
          <h2 className="text-xl font-bold text-foreground mb-1">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mb-6">Add some delicious items from the menu</p>
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
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Checkout</h1>
        <p className="text-muted-foreground text-sm mb-6">Review and confirm your order.</p>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 animate-fade-in">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.tags.join(" • ")}</p>
                <p className="font-bold text-primary mt-1">${Number(item.price).toFixed(2)}</p>
                <p className="text-[10px] text-primary/70">+{Math.round(Number(item.price) * 10 * item.quantity)} pts</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center btn-press">
                  {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-destructive" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center btn-press">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loyalty Points Redemption */}
        {loyalty.points >= 100 && (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏅</span>
                <div>
                  <p className="font-bold text-foreground text-sm">Redeem Loyalty Points</p>
                  <p className="text-xs text-muted-foreground">You have {loyalty.points} pts → saves ${pointsToDiscount(Math.min(loyalty.points, 500)).toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => setUsePoints(!usePoints)}
                className={`w-10 h-6 rounded-full transition-all relative ${usePoints ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${usePoints ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Payment & Summary */}
        <div className="bg-card rounded-2xl p-5 card-shadow border border-border">
          <h3 className="font-bold text-foreground mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${paymentMethod === "online" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted text-muted-foreground"}`}
            >
              <span className="text-xl mb-1">💳</span>
              <span className="text-xs font-bold uppercase">Online</span>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${paymentMethod === "cash" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted text-muted-foreground"}`}
            >
              <span className="text-xl mb-1">💵</span>
              <span className="text-xs font-bold uppercase">Cash</span>
            </button>
          </div>

          <h3 className="font-bold text-foreground mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold">${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Service Tax (5%)</span><span className="font-bold">${tax.toFixed(2)}</span></div>
            {usePoints && pointsDiscount > 0 && (
              <div className="flex justify-between"><span className="text-primary flex items-center gap-1"><Tag className="w-3 h-3" /> Points Discount</span><span className="font-bold text-primary">-${pointsDiscount.toFixed(2)}</span></div>
            )}
            <div className="border-t border-border my-3" />
            <div className="flex justify-between text-xl"><span className="font-extrabold">Total</span><span className="font-extrabold text-primary">${total.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Points Preview */}
        <div className="mt-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">You'll earn</span>
          <span className="font-bold text-primary">🏅 +{pointsEarned} loyalty points</span>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-5 mb-8 flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg btn-press hover:opacity-90 transition shadow-lg shadow-primary/20"
        >
          Confirm & Pay <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default CartPage;
