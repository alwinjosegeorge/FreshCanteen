import { useState } from "react";
import { Settings, Bell, Lock, Globe, Moon, ShieldCheck, Trash2, Save, AlertTriangle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { resetMenu, clearSession } from "@/data/storage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [acceptingOrders, setAcceptingOrders] = useState(true);
    const [nightMode, setNightMode] = useState(false);

    const handleSave = () => {
        localStorage.setItem("fc_settings", JSON.stringify({ notifications, acceptingOrders, nightMode }));
        toast.success("Settings saved successfully!");
    };

    const handleResetMenu = () => {
        if (window.confirm("Reset menu to defaults? This will remove any custom items.")) {
            resetMenu();
            toast.success("Menu reset to defaults!");
        }
    };

    const handleClearOrders = () => {
        if (window.confirm("Clear ALL order history? This cannot be undone.")) {
            localStorage.removeItem("fc_orders");
            toast.success("Order history cleared");
        }
    };

    const handleLogout = () => {
        clearSession();
        toast.success("Logged out");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <AppHeader />
            <div className="px-4 pt-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">System Settings</h1>
                <p className="text-muted-foreground text-sm mb-6">Configure FreshCanteen parameters.</p>

                <div className="space-y-6">
                    {/* Operations */}
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 px-1">Canteen Operations</h3>
                        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
                            {[
                                { icon: Bell, label: "Order Notifications", desc: "Alert staff on new orders", color: "text-orange-500 bg-orange-500/10", value: notifications, set: setNotifications },
                                { icon: Globe, label: "Accepting Orders", desc: "Students can place orders", color: "text-blue-500 bg-blue-500/10", value: acceptingOrders, set: setAcceptingOrders },
                                { icon: Moon, label: "Night Mode Schedule", desc: "Auto-close after hours", color: "text-purple-500 bg-purple-500/10", value: nightMode, set: setNightMode },
                            ].map((item, i) => (
                                <div key={item.label} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-border/50" : ""}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-foreground block">{item.label}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => item.set(!item.value)}
                                        className={`w-10 h-6 rounded-full transition-all relative ${item.value ? "bg-primary" : "bg-muted"}`}
                                    >
                                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.value ? "translate-x-4" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Security */}
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 px-1">Security & Access</h3>
                        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
                            <button onClick={() => toast.info("Admin: admin@freshcanteen.com / admin123")} className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-500"><Lock className="w-4 h-4" /></div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground block">Admin Credentials</span>
                                        <span className="text-[10px] text-muted-foreground">admin@freshcanteen.com</span>
                                    </div>
                                </div>
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">View</span>
                            </button>
                            <button onClick={() => toast.info("All staff have full canteen access")} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><ShieldCheck className="w-4 h-4" /></div>
                                    <span className="text-sm font-bold text-foreground">Access Permissions</span>
                                </div>
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">All Staff</span>
                            </button>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 px-1">Data Management</h3>
                        <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
                            <button onClick={handleResetMenu} className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center text-warning"><Settings className="w-4 h-4" /></div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground block">Reset Menu</span>
                                        <span className="text-[10px] text-muted-foreground">Restore default food items</span>
                                    </div>
                                </div>
                                <span className="text-warning text-xs font-bold uppercase">Reset</span>
                            </button>
                            <button onClick={handleClearOrders} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive"><Trash2 className="w-4 h-4" /></div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground block">Clear Orders</span>
                                        <span className="text-[10px] text-muted-foreground">Wipe all order history</span>
                                    </div>
                                </div>
                                <span className="text-destructive text-xs font-bold uppercase">Clear</span>
                            </button>
                        </div>
                    </section>

                    <button onClick={handleSave} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 btn-press shadow-xl shadow-primary/20">
                        <Save className="w-5 h-5" /> Save Settings
                    </button>

                    <button onClick={handleLogout} className="w-full h-12 rounded-xl border border-destructive text-destructive font-bold text-sm flex items-center justify-center gap-2 btn-press hover:bg-destructive/5 transition">
                        Logout from Admin
                    </button>

                    <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-4 pb-4 opacity-50">FreshCanteen v2.0 — admin@freshcanteen.com</p>
                </div>
            </div>
            <BottomNav variant="admin" />
        </div>
    );
};

export default AdminSettingsPage;
