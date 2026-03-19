import { ClipboardList, DollarSign, ShoppingBag, TrendingUp, Calendar, Download } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import foodAvocadoBowl from "@/assets/food-avocado-bowl.jpg";
import foodPestoFlatbread from "@/assets/food-pesto-flatbread.jpg";
import foodChickenCaesar from "@/assets/food-chicken-caesar.jpg";
import foodFalafel from "@/assets/food-falafel.jpg";

const stats = [
  { icon: ClipboardList, label: "TOTAL ORDERS", value: "125", change: "+12.5% from yesterday", bg: "bg-accent" },
  { icon: DollarSign, label: "TODAY'S REVENUE", value: "$1,200", change: "$240 today", bg: "bg-accent" },
  { icon: ShoppingBag, label: "ACTIVE ORDERS", value: "8", change: "Orders in queue", bg: "bg-accent" },
];

const recentOrders = [
  { name: "Quinoa Power Bowl", id: "#9421", date: "Oct 24, 12:30 PM", price: "$12.50", status: "Completed", image: foodAvocadoBowl },
  { name: "Pesto Garden Pasta", id: "#9422", date: "Oct 24, 12:35 PM", price: "$14.00", status: "Preparing", image: foodPestoFlatbread },
  { name: "Classic Avocado Toast", id: "#9423", date: "Oct 24, 12:42 PM", price: "$10.50", status: "Pending", image: foodChickenCaesar },
];

const AdminDashboard = () => (
  <div className="min-h-screen bg-background pb-20">
    <AppHeader />
    <div className="px-4 pt-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Daily Overview</h1>
      <p className="text-muted-foreground text-sm mb-4">Monitor your canteen's performance in real-time.</p>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Oct 24, 2023</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold btn-press">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 card-shadow animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
          <p className="text-xs text-muted-foreground">Live feed of canteen transactions</p>
        </div>
        <button className="text-sm font-semibold text-primary">View All</button>
      </div>

      <div className="space-y-3 mb-6">
        {recentOrders.map((o) => (
          <div key={o.id} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-3 animate-fade-in">
            <img src={o.image} alt={o.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{o.name}</p>
              <p className="text-xs text-muted-foreground">Order {o.id} • {o.date}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-foreground text-sm">{o.price}</p>
              <StatusBadge status={o.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-5 card-shadow mb-4">
        <h3 className="font-bold text-foreground mb-3">Popular Today</h3>
        {[
          { name: "Greek Salad", sold: 42, image: foodFalafel },
          { name: "Veggie Ramen", sold: 38, image: foodPestoFlatbread },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-3 py-2">
            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">{p.sold} Sold</p>
              <p className="font-semibold text-foreground text-sm">{p.name}</p>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
        ))}
        <button className="w-full mt-3 h-10 rounded-xl border border-border text-foreground font-medium text-sm btn-press hover:bg-muted transition">Manage Menu Items</button>
      </div>

      <div className="bg-card rounded-2xl p-5 card-shadow mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🔥</span>
          <h3 className="font-bold text-foreground">Crowd Density</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Current estimated wait time in the canteen area.</p>
        <p className="text-3xl font-extrabold text-foreground mb-1">12 <span className="text-base font-medium text-muted-foreground">mins wait</span></p>
        <div className="w-full h-2 rounded-full bg-muted mb-2">
          <div className="w-1/2 h-2 rounded-full bg-primary" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-warning">Status: Moderate</p>
      </div>
    </div>
    <BottomNav variant="admin" />
  </div>
);

export default AdminDashboard;
