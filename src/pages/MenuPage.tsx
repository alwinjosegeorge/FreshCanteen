import { useState, useEffect } from "react";
import { Search, Star, ShoppingCart, X, Flame, Leaf, Clock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/context/CartContext";
import { getStoredMenu, MenuItem, getAnnouncements, Announcement, estimateWait, formatPrice } from "@/data/storage";
import { toast } from "sonner";

const categories = ["All", "Meals", "Snacks", "Drinks"] as const;

const ItemModal = ({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    <div className="relative w-full max-w-lg bg-card rounded-t-3xl p-6 z-10 animate-slide-up" onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xl font-extrabold text-foreground pr-8">{item.name}</h2>
        <span className="text-xl font-black text-primary">{formatPrice(item.price)}</span>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {item.tags.map(t => <span key={t} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{t}</span>)}
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.category}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-muted rounded-xl p-3 text-center">
          <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Calories</p>
          <p className="font-bold text-foreground">{item.calories}</p>
        </div>
        <div className="bg-muted rounded-xl p-3 text-center">
          <Leaf className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Protein</p>
          <p className="font-bold text-foreground">{Math.round(item.calories * 0.08)}g</p>
        </div>
        <div className="bg-muted rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Prep Time</p>
          <p className="font-bold text-foreground">~8 min</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-muted-foreground font-medium">Earn loyalty points</span>
        <span className="font-bold text-primary">+{Math.round(item.price * 10)} pts 🏅</span>
      </div>
      <button
        onClick={() => { onAdd(); onClose(); }}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base btn-press hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" /> Add to Cart — {formatPrice(item.price)}
      </button>
    </div>
  </div>
);

const AnnouncementBanner = ({ a, onDismiss }: { a: Announcement; onDismiss: () => void }) => (
  <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-4 flex items-start gap-3 relative animate-fade-in">
    <span className="text-2xl">{a.emoji}</span>
    <div className="flex-1">
      <p className="font-bold text-foreground text-sm">{a.title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{a.body}</p>
    </div>
    <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition flex-shrink-0">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [waitTime, setWaitTime] = useState(4);
  const { addItem, totalItems } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menu, announce, wait] = await Promise.all([
        getStoredMenu(),
        getAnnouncements(),
        estimateWait()
      ]);
      setMenuItems(menu);
      setAnnouncements(announce);
      setWaitTime(wait);
    } catch (err) {
      console.error("Error loading menu data:", err);
      toast.error("Failed to load menu. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.available;
  });

  const handleAdd = (item: MenuItem) => {
    addItem(item as any);
    toast.success(`✅ ${item.name} added! +${Math.round(item.price * 10)} pts`);
  };

  const visibleAnnouncements = announcements.filter(a => a.pinned && !dismissed.includes(a.id || (a as any)._id));

  return (
    <div className="min-h-screen bg-background pb-20">
      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={() => handleAdd(selectedItem)} />}
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
            <p className="text-sm font-medium">Fetching fresh picks...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">🌿 FreshCanteen</h1>
              <div className="flex items-center gap-3">
                {waitTime > 0 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-card border border-border rounded-full px-3 py-1">
                    <Clock className="w-3 h-3" /> ~{waitTime} min
                  </div>
                )}
                {totalItems > 0 && (
                  <div className="flex items-center gap-1 text-primary font-bold text-sm">
                    <ShoppingCart className="w-4 h-4" /> {totalItems}
                  </div>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Today's fresh picks. Tap item for details.</p>

            {/* Announcements */}
            {visibleAnnouncements.map(a => (
              <AnnouncementBanner key={a.id || (a as any)._id} a={a} onDismiss={() => setDismissed(d => [...d, a.id || (a as any)._id])} />
            ))}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meals, drinks, snacks..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition text-sm"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap btn-press transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="space-y-4">
              {filtered.map((item, idx) => (
                <div
                  key={item.id || (item as any)._id}
                  className="bg-card rounded-2xl overflow-hidden card-shadow animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-xs font-semibold">4.{5 + (item.name.length % 4)}</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">{item.category}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                      +{Math.round(item.price * 10)} pts
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{tag}</span>
                      ))}
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.calories} KCAL</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                      className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 btn-press hover:opacity-90 transition shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🍽️</p>
                <p className="text-muted-foreground font-medium">No items found</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-4 text-primary font-semibold text-sm hover:underline">Clear Filters</button>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MenuPage;
