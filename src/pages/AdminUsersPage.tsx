import { useEffect, useState } from "react";
import { Search, UserPlus, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getStoredOrders, API_URL } from "@/data/storage";
import { toast } from "sonner";
import axios from "axios";

interface UserRecord {
    _id?: string;
    admissionNumber: string;
    name: string;
    role: string;
    points: number;
    orders: number;
}

const AdminUsersPage = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, ordersRes] = await Promise.all([
                axios.get(`${API_URL}/users`),
                getStoredOrders()
            ]);

            const allUsers = usersRes.data;
            const allOrders = ordersRes;

            const mappedUsers = allUsers.map((u: any) => ({
                ...u,
                orders: allOrders.filter((o: any) => o.admissionNumber === u.admissionNumber).length
            }));

            setUsers(mappedUsers);
        } catch (err) {
            console.error("Error loading users:", err);
            toast.error("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.admissionNumber.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (id === "admin") { toast.error("Cannot remove admin account"); return; }
        // For now, just a UI mock or we could add an API call
        setUsers(prev => prev.filter(u => (u._id || u.admissionNumber) !== id));
        toast.success("User removed from view");
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <AppHeader />
            <div className="px-4 pt-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">User Directory</h1>
                <p className="text-muted-foreground text-sm mb-6">Student database and order statistics.</p>

                <div className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or admission number..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary transition text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <button onClick={() => toast.info("Importing students via Excel...")} className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center btn-press">
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-card rounded-2xl p-4 border border-border card-shadow text-center">
                        <p className="text-2xl font-black text-primary">{users.filter(u => u.role === "student").length}</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Students</p>
                    </div>
                    <div className="bg-card rounded-2xl p-4 border border-border card-shadow text-center">
                        <p className="text-2xl font-black text-foreground">{users.reduce((s, u) => s + u.orders, 0)}</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Total Orders</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-card rounded-2xl p-8 text-center border border-border">
                        <p className="text-4xl mb-3">👥</p>
                        <p className="text-muted-foreground font-medium">No users found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((user) => {
                            const userId = user._id || user.admissionNumber;
                            return (
                                <div key={userId} className="bg-card rounded-2xl p-4 border border-border card-shadow group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-foreground text-sm truncate">{user.name}</h3>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{user.admissionNumber}</p>
                                        </div>
                                        <button onClick={() => handleDelete(userId)} className="p-2 text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Points: {user.points}</p>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{user.orders} Orders</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <BottomNav variant="admin" />
        </div>
    );
};

export default AdminUsersPage;
