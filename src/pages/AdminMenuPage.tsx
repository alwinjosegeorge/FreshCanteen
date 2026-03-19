import { useState, useRef, useEffect } from "react";
import { Search, Plus, X, Check, Upload, ImagePlus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getStoredMenu, updateStoredMenu, MenuItem, deleteMenuItem } from "@/data/storage";
import { toast } from "sonner";

const CATEGORIES = ["All Items", "Meals", "Snacks", "Drinks"] as const;
const FALLBACK = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";

const AdminMenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Meals", calories: "", tags: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMenu = async () => {
    setLoading(true);
    const data = await getStoredMenu();
    setMenu(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // ── Image handling ──────────────────────────────────────────────────────────

  const loadImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      toast.success("Image ready! ✅");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadImageFile(file);
  };

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const toggleAvailability = async (item: MenuItem) => {
    const updatedItem = { ...item, available: !item.available };
    await updateStoredMenu(updatedItem);
    loadMenu();
    toast.success(`${item.name} is now ${!item.available ? "Available" : "Out of Stock"}`);
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill in at least the name and price.");
      return;
    }
    const tagList = newItem.tags
      ? newItem.tags.split(",").map(t => t.trim().toUpperCase()).filter(Boolean)
      : [newItem.category.toUpperCase()];

    const item: Partial<MenuItem> = {
      name: newItem.name,
      price: parseFloat(newItem.price) || 0,
      image: imagePreview || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600`,
      category: newItem.category,
      tags: tagList,
      calories: parseInt(newItem.calories) || 200,
      available: true,
      id: `custom-${Date.now()}` // Keeping for legacy if needed
    };

    await updateStoredMenu(item);
    setShowAdd(false);
    setNewItem({ name: "", price: "", category: "Meals", calories: "", tags: "" });
    setImagePreview(null);
    loadMenu();
    toast.success(`🎉 "${item.name}" added to MongoDB!`);
  };

  const resetForm = () => {
    setShowAdd(false);
    setNewItem({ name: "", price: "", category: "Meals", calories: "", tags: "" });
    setImagePreview(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name}?`)) {
      await deleteMenuItem(id);
      loadMenu();
      toast.success(`"${name}" removed from database`);
    }
  };

  const filtered = menu.filter(item => {
    const matchCat = activeCategory === "All Items" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Menu Manager</h1>
        <p className="text-muted-foreground text-sm mb-4">Managing live MongoDB data.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1">Available</p>
            <p className="text-3xl font-black text-primary">{menu.filter(i => i.available).length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border card-shadow text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1">Total Items</p>
            <p className="text-3xl font-black text-foreground">{menu.length}</p>
          </div>
        </div>

        {/* ── ADD ITEM FORM ── */}
        {showAdd && (
          <div className="bg-card rounded-2xl border border-primary/30 mb-5 overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-primary" /> Add New Food Item
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Upload an image → fill details → tap Add</p>
            </div>

            {/* Image Upload Zone */}
            <div className="p-5 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Food Image</p>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                      <p className="text-white font-bold text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setImagePreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-sm">Tap to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">or drag & drop here</p>
                    <p className="text-[10px] text-muted-foreground mt-2 opacity-60">JPG · PNG · WEBP · Max 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Item Details */}
            <div className="p-5 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Item Name *</label>
                <input
                  value={newItem.name}
                  onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Spicy Tofu Rice Bowl"
                  className="w-full h-11 px-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Price ($) *</label>
                  <input
                    value={newItem.price}
                    onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}
                    placeholder="e.g. 9.50"
                    type="number"
                    min="0"
                    step="0.25"
                    className="w-full h-11 px-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Calories</label>
                  <input
                    value={newItem.calories}
                    onChange={e => setNewItem(p => ({ ...p, calories: e.target.value }))}
                    placeholder="e.g. 420"
                    type="number"
                    min="0"
                    className="w-full h-11 px-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Category</label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-muted text-foreground focus:ring-2 focus:ring-primary outline-none text-sm"
                >
                  <option>Meals</option>
                  <option>Snacks</option>
                  <option>Drinks</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Tags (comma separated)</label>
                <input
                  value={newItem.tags}
                  onChange={e => setNewItem(p => ({ ...p, tags: e.target.value }))}
                  placeholder="e.g. VEGAN, SPICY, HIGH PROTEIN"
                  className="w-full h-11 px-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={addItem}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm btn-press flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:opacity-90 transition"
                >
                  <Check className="w-4 h-4" /> Add to Menu
                </button>
                <button
                  onClick={resetForm}
                  className="h-12 px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-sm btn-press"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap btn-press transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
            <p className="text-sm font-medium">Syncing with MongoDB...</p>
          </div>
        )}

        {/* Items */}
        {!loading && (
          <div className="space-y-3 mb-6">
            {filtered.map((item) => (
              <div key={item._id || item.id} className="bg-card rounded-2xl p-4 border border-border card-shadow animate-fade-in">
                <div className="flex items-start gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">${Number(item.price).toFixed(2)} · {item.calories} kcal</p>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {item.tags.map((t) => <span key={t} className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${item.available ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.available ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <button onClick={() => handleDelete(item._id!, item.name)} className="text-[10px] font-bold text-destructive hover:underline uppercase">Remove</button>
                  </div>
                </div>
                {!item.available && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-2">⚠ Out of Stock — Hidden from students</p>}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">No items found matching your search.</div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center btn-press z-30 hover:opacity-90 transition"
      >
        {showAdd ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminMenuPage;
