import { useEffect, useState } from "react";
import { ClipboardList, DollarSign, ShoppingBag, TrendingUp, Users, RefreshCw, ArrowRight, Megaphone, Plus, X, Star } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { getStoredOrders, Order, getAnnouncements, addAnnouncement, deleteAnnouncementApi, Announcement, formatPrice } from "@/data/storage";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newEmoji, setNewEmoji] = useState("📢");

  const loadData = async () => {
    if (orders.length === 0) setLoading(true);
    try {
      const [orderData, announceData] = await Promise.all([
        getStoredOrders(),
        getAnnouncements()
      ]);
      setOrders(orderData);
      setAnnouncements(announceData);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddAnnouncement = async () => {
    if (!newTitle || !newBody) { toast.error("Please fill title and message"); return; }
    await addAnnouncement({ title: newTitle, body: newBody, emoji: newEmoji, pinned: true });
    loadData();
    setNewTitle(""); setNewBody(""); setNewEmoji("📢");
    setShowAddAnnouncement(false);
    toast.success("Announcement posted to MongoDB!");
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await deleteAnnouncementApi(id);
    loadData();
    toast.success("Announcement removed");
  };

  const pending = orders.filter(o => o.status === "Pending").length;
  const preparing = orders.filter(o => o.status === "Preparing").length;
  const ready = orders.filter(o => o.status === "Ready").length;
  const completed = orders.filter(o => o.status === "Completed").length;
  const totalRevenue = orders.reduce((s, o) => s + (o.totalNum || 0), 0);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { icon: ClipboardList, label: "PENDING ORDERS", value: pending.toString(), change: `${preparing} preparing`, bg: "bg-primary/10" },
    { icon: DollarSign, label: "TOTAL REVENUE", value: formatPrice(totalRevenue), change: `${orders.length} orders total`, bg: "bg-primary/10" },
    { icon: ShoppingBag, label: "READY FOR PICKUP", value: ready.toString(), change: `${completed} completed`, bg: "bg-primary/10" },
    { icon: Users, label: "TOTAL STUDENTS", value: new Set(orders.map(o => o.studentEmail)).size.toString(), change: "Unique customers", bg: "bg-primary/10" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Canteen Analytics</h1>
          <button onClick={loadData} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center btn-press hover:bg-border transition">
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading && orders.length > 0 ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-6">Live performance — updates every 5s</p>

        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
            <p className="text-sm font-medium">Syncing dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((s, i) => (
                <div key={s.label} className="bg-card rounded-2xl p-4 border border-border card-shadow animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-primary font-medium">{s.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Pipeline */}
            <div className="bg-card rounded-2xl p-5 card-shadow mb-6 border border-border">
              <h3 className="font-bold text-foreground mb-4">Order Pipeline</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Pending", count: pending, color: "text-warning" },
                  { label: "Preparing", count: preparing, color: "text-blue-400" },
                  { label: "Ready", count: ready, color: "text-primary" },
                  { label: "Done", count: completed, color: "text-green-500" },
                ].map(p => (
                  <div key={p.label} className="text-center bg-muted rounded-xl p-3">
                    <p className={`text-2xl font-black ${p.color}`}>{p.count}</p>
                    <p className="text-[9px] font-bold uppercase text-muted-foreground">{p.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 text-center border border-border mb-6">
                <p className="text-muted-foreground text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {recentOrders.map((o) => (
                  <div key={o._id || o.id} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-3 animate-fade-in border border-border">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 font-black text-primary text-sm">{o.token.replace("#", "")}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{o.student}</p>
                      <p className="text-xs text-muted-foreground truncate">{o.items}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-foreground text-sm">{o.total}</p>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Announcements Section */}
      <div className="px-4 max-w-lg mx-auto mb-20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" /> Announcements
          </h2>
          <button
            onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {showAddAnnouncement && (
          <div className="bg-card rounded-2xl p-5 border border-primary/30 mb-4 animate-fade-in">
            <div className="flex gap-2 mb-3">
              {["📢", "🎉", "🌿", "⚡", "🔥", "🎁"].map(e => (
                <button key={e} onClick={() => setNewEmoji(e)} className={`text-xl p-1 rounded-lg ${newEmoji === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"}`}>{e}</button>
              ))}
            </div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title (e.g. 50% off smoothies!)" className="w-full h-11 px-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm mb-3" />
            <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Message to students..." rows={2} className="w-full px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm mb-3 resize-none" />
            <div className="flex gap-2">
              <button onClick={handleAddAnnouncement} className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm btn-press">Post Announcement</button>
              <button onClick={() => setShowAddAnnouncement(false)} className="h-10 px-4 rounded-xl bg-muted btn-press"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>
        )}

        {announcements.length === 0 ? (
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <p className="text-muted-foreground text-sm">No announcements posted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a._id || a.id} className="bg-card rounded-2xl p-4 border border-border flex items-start gap-3">
                <span className="text-2xl">{a.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 opacity-60">{a.createdAt}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(a._id || a.id)} className="text-muted-foreground hover:text-destructive transition flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminDashboard;
