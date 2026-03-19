import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { User, Settings, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => (
  <div className="min-h-screen bg-background pb-20">
    <AppHeader />
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="bg-card rounded-2xl p-6 card-shadow text-center mb-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent mx-auto flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Alex Thompson</h2>
        <p className="text-sm text-muted-foreground">alex@university.edu</p>
        <p className="text-xs text-muted-foreground mt-1">Student ID: STU-2024-0891</p>
      </div>

      <div className="bg-card rounded-2xl card-shadow overflow-hidden mb-6">
        {[
          { icon: CreditCard, label: "Payment Methods", desc: "Manage cards" },
          { icon: Settings, label: "Preferences", desc: "Dietary, notifications" },
          { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us" },
        ].map((item, i) => (
          <button key={item.label} className={`w-full flex items-center gap-4 p-4 hover:bg-muted transition text-left ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <Link to="/" className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-destructive text-destructive font-semibold text-sm btn-press hover:bg-destructive/5 transition">
        <LogOut className="w-4 h-4" /> Log Out
      </Link>
    </div>
    <BottomNav />
  </div>
);

export default ProfilePage;
