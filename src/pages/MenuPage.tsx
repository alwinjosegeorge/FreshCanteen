import { useState } from "react";
import { Search, Star } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/context/CartContext";
import { menuItems, MenuItem } from "@/data/menuData";
import { toast } from "sonner";

const categories = ["All", "Meals", "Snacks", "Drinks"] as const;

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.available;
  });

  const handleAdd = (item: MenuItem) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Good afternoon, Alex!</h1>
        <p className="text-muted-foreground text-sm mb-4">What's on the menu today?</p>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for bowls, sandwiches, or..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition text-sm"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap btn-press transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <div key={item.id} className="bg-card rounded-2xl overflow-hidden card-shadow animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-xs font-semibold">4.{5 + (parseInt(item.id) % 4)}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{tag}</span>
                  ))}
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.calories} KCAL</span>
                </div>
                <button onClick={() => handleAdd(item)} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 btn-press hover:opacity-90 transition">
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-muted-foreground font-medium">No items found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        )}

        <div className="mt-6 bg-accent rounded-2xl p-5 card-shadow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-1">Weekly Special</p>
          <h3 className="text-xl font-bold text-foreground mb-1">50% Off on Fresh Smoothies</h3>
          <p className="text-sm text-muted-foreground mb-3">Boost your afternoon energy with our vitamin-packed cold-pressed smoothies. Valid until Friday.</p>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm btn-press">Claim Offer</button>
        </div>

        <div className="mt-4 mb-4 bg-card rounded-2xl p-5 border border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Flash Rewards</p>
          <p className="text-sm text-foreground">Earn double points on all plant-based meals today!</p>
          <p className="text-3xl font-extrabold text-primary mt-2">2X</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MenuPage;
