import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { User, Settings, CreditCard, HelpCircle, LogOut, ClipboardList, Bell, ChevronRight, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession, getStoredOrders, Order, getLoyalty, rateOrderApi, formatPrice } from "@/data/storage";
import { toast } from "sonner";

const StarRating = ({ orderId, current, onRate }: { orderId: string; current?: number; onRate: () => void }) => {
  const [hover, setHover] = useState(0);
  const [rated, setRated] = useState(current || 0);

  const handleRate = async (stars: number) => {
    setRated(stars);
    await rateOrderApi(orderId, stars);
    onRate();
    toast.success(`⭐ Rated ${stars} stars! Thanks for your feedback!`);
  };

  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          onClick={() => handleRate(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`w-4 h-4 ${(hover || rated) >= s ? "text-warning fill-warning" : "text-muted-foreground"}`} />
        </button>
      ))}
      {rated > 0 && <span className="text-[10px] text-muted-foreground ml-1">({rated}/5)</span>}
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const session = getSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [loyalty, setLoyalty] = useState({ points: 0, totalEarned: 0, email: "" });
  const [loading, setLoading] = useState(true);

  const loadProfileData = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const allOrders = await getStoredOrders();
      const myOrders = allOrders.filter(o => o.studentEmail === session.email);
      const pointsData = await getLoyalty(session.email);

      setOrders(myOrders);
      setLoyalty(pointsData);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const totalSpent = orders.reduce((s, o) => s + (o.totalNum || 0), 0);
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const tier = loyalty.totalEarned >= 500 ? "Gold 🥇" : loyalty.totalEarned >= 200 ? "Silver 🥈" : "Bronze 🥉";

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-6 max-w-lg mx-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-6 card-shadow text-center mb-4 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary px-4 rounded-bl-2xl">Student Profile</div>
          <div className="w-20 h-20 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{session?.name || "Student"}</h2>
          <p className="text-sm font-medium text-muted-foreground">{session?.email || "student@freshcanteen.com"}</p>
          <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-full">ID: {session?.id?.toUpperCase() || "STU-0000"}</p>
        </div>

        {/* Loyalty Card */}
        <div className="bg-gradient-to-br from-primary to-primary/70 rounded-2xl p-5 mb-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 text-8xl font-black tracking-tighter">🌿</div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">FreshCanteen Loyalty</p>
            <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full">{tier}</span>
          </div>
          <p className="text-4xl font-black tracking-tighter">{loyalty.points.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-0.5">available points</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-[10px] opacity-60">{loyalty.totalEarned} total earned</p>
            <p className="text-[10px] font-bold opacity-80">100 pts = {formatPrice(2)} off 🎁</p>
          </div>
          {/* Progress to next tier */}
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-white/20">
              <div className="h-1.5 rounded-full bg-white/80 transition-all" style={{ width: `${Math.min(100, (loyalty.totalEarned % 300) / 3)}%` }} />
            </div>
            <p className="text-[9px] opacity-60 mt-1">{300 - (loyalty.totalEarned % 300)} pts to next tier</p>
          </div>
        </div>

        {/* Loading Stats */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-card rounded-2xl p-3 card-shadow text-center border border-border">
                <p className="text-2xl font-black text-primary">{orders.length}</p>
                <p className="text-[9px] font-bold uppercase text-muted-foreground">Orders</p>
              </div>
              <div className="bg-card rounded-2xl p-3 card-shadow text-center border border-border">
                <p className="text-2xl font-black text-foreground">{completedOrders}</p>
                <p className="text-[9px] font-bold uppercase text-muted-foreground">Completed</p>
              </div>
              <div className="bg-card rounded-2xl p-3 card-shadow text-center border border-border">
                <p className="text-2xl font-black text-primary">{formatPrice(totalSpent)}</p>
                <p className="text-[9px] font-bold uppercase text-muted-foreground">Spent</p>
              </div>
            </div>

            {/* Order History */}
            <h3 className="font-bold text-foreground mb-4 px-1 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              Order History
            </h3>
            {orders.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 text-center border border-border mb-6">
                <p className="text-muted-foreground text-sm">No orders yet. <Link to="/menu" className="text-primary font-semibold hover:underline">Browse menu →</Link></p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id || order.id} className="bg-card rounded-2xl p-4 card-shadow border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">{order.token}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{order.date}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[170px]">{order.items}</p>
                        {/* Star Rating for completed orders */}
                        {order.status === "Completed" && (
                          <StarRating orderId={order._id || order.id} current={order.rating} onRate={loadProfileData} />
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-primary text-sm">{order.total}</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${order.status === "Completed" ? "text-green-500" : order.status === "Ready" ? "text-primary" : "text-warning"}`}>{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Settings */}
        <div className="bg-card rounded-2xl card-shadow overflow-hidden mb-6">
          <button
            onClick={() => { setNotificationsOn(!notificationsOn); toast.success(notificationsOn ? "Notifications disabled" : "Notifications enabled"); }}
            className="w-full flex items-center gap-4 p-4 hover:bg-muted transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Bell className="w-5 h-5 text-muted-foreground" /></div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">Notifications</p>
              <p className="text-xs text-muted-foreground">Order updates & alerts</p>
            </div>
            <div className={`w-10 h-5 rounded-full transition-all ${notificationsOn ? "bg-primary" : "bg-muted"} relative`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notificationsOn ? "translate-x-5" : "translate-x-1"}`} />
            </div>
          </button>
          {[
            { icon: CreditCard, label: "Payment Methods", desc: "Manage cards & wallets", action: () => toast.info("💳 Payments: Online & Cash supported") },
            { icon: Star, label: "Favourites", desc: "Your saved meals", action: () => toast.info("⭐ Favourites coming soon!") },
            { icon: Settings, label: "Preferences", desc: "Dietary & notifications", action: () => toast.info("🥗 Dietary preferences coming soon!") },
            { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us", action: () => toast.info("📧 freshcanteen@university.edu") },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="w-full flex items-center gap-4 p-4 hover:bg-muted transition text-left border-t border-border">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><item.icon className="w-5 h-5 text-muted-foreground" /></div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-destructive text-destructive font-semibold text-sm btn-press hover:bg-destructive/5 transition mb-4"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
