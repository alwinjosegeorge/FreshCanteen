import { Minus, Plus, ArrowRight, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const tax = totalPrice * 0.08;
  const discount = totalPrice > 20 ? 2 : 0;
  const total = totalPrice + tax - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <p className="text-5xl mb-4">🛒</p>
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
        <h1 className="text-2xl font-bold text-foreground mb-1">Your Cart</h1>
        <p className="text-muted-foreground text-sm mb-6">Review your selected meals before checking out.</p>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 animate-fade-in">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.tags.join(" • ")} • {item.calories} kcal</p>
                <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center btn-press hover:bg-border transition">
                  {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-destructive" /> : <Minus className="w-3.5 h-3.5 text-foreground" />}
                </button>
                <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center btn-press hover:bg-border transition">
                  <Plus className="w-3.5 h-3.5 text-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-card rounded-2xl p-5 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estimated Tax</span><span className="font-medium">${tax.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Student Discount</span><span className="font-medium text-primary">-${discount.toFixed(2)}</span></div>}
            <div className="border-t border-border my-3" />
            <div className="flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold text-primary">${total.toFixed(2)}</span></div>
          </div>
        </div>

        <Link
          to="/order-success"
          className="mt-4 mb-4 flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg btn-press hover:opacity-90 transition"
        >
          Place Order <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      <BottomNav />
    </div>
  );
};

export default CartPage;
