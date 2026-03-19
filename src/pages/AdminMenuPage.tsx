import { useState } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { menuItems } from "@/data/menuData";

const categories = ["All Items", "Main Course", "Salads", "Beverages", "Soups"];

const AdminMenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(menuItems.map((i) => [i.id, i.available]))
  );

  const toggleAvailability = (id: string) =>
    setAvailability((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
        <p className="text-muted-foreground text-sm mb-4">Curate today's offerings and manage stock availability.</p>

        <div className="flex gap-3 mb-4">
          <div className="bg-muted rounded-xl px-4 py-3 flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Live Items</p>
            <p className="text-2xl font-bold text-foreground">{Object.values(availability).filter(Boolean).length}</p>
          </div>
          <div className="bg-muted rounded-xl px-4 py-3 flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold text-foreground">06</p>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search dishes, ingredients..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition text-sm"
          />
        </div>

        <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap btn-press transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
              {c}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-primary mb-4">
          <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
        </button>

        <div className="space-y-3 mb-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl p-4 card-shadow animate-fade-in">
              <div className="flex items-start gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                  {!availability[item.id] && <p className="text-xs font-semibold text-destructive uppercase">Out of Stock</p>}
                  <div className="flex gap-1.5 mt-1">
                    {item.tags.map((t) => <span key={t} className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{t}</span>)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                </div>
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${availability[item.id] ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-card shadow transition-transform ${availability[item.id] ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground text-center mb-4">Showing 1-{menuItems.length} of {menuItems.length} items</p>
      </div>

      <button className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center btn-press z-30">
        <Plus className="w-6 h-6" />
      </button>

      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminMenuPage;
