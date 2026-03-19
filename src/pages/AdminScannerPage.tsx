import { useState } from "react";
import { CheckCircle2, User, RotateCcw } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getStoredOrders, updateOrderStatus, Order } from "@/data/storage";
import { toast } from "sonner";

const AdminScannerPage = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      // Get first non-completed order
      const orders = getStoredOrders().filter(o => o.status !== "Completed");
      if (orders.length > 0) {
        setScannedOrder(orders[0]);
        setTokenInput(orders[0].token);
        toast.success("Token detected!");
      } else {
        toast.error("No active orders to scan");
      }
      setScanning(false);
    }, 1000);
  };

  const searchByToken = () => {
    if (!tokenInput.trim()) {
      toast.error("Enter a token number first");
      return;
    }
    const q = tokenInput.includes("TK") ? tokenInput : `#TK-${tokenInput}`;
    const orders = getStoredOrders();
    const found = orders.find(o => o.token.toLowerCase() === q.toLowerCase() || o.token.replace("#TK-", "") === tokenInput.replace("#TK-", ""));
    if (found) {
      setScannedOrder(found);
      toast.success(`Order found: ${found.token}`);
    } else {
      toast.error(`Token ${q} not found`);
      setScannedOrder(null);
    }
  };

  const completeOrder = () => {
    if (!scannedOrder) return;
    updateOrderStatus(scannedOrder.id, "Completed");
    toast.success(`✅ Order ${scannedOrder.token} marked as Completed!`);
    setScannedOrder(null);
    setTokenInput("");
  };

  const readyOrder = () => {
    if (!scannedOrder) return;
    updateOrderStatus(scannedOrder.id, "Ready");
    setScannedOrder(prev => prev ? { ...prev, status: "Ready" } : null);
    toast.success(`Order ${scannedOrder.token} is now Ready!`);
  };

  const reset = () => {
    setScannedOrder(null);
    setTokenInput("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Pickup Terminal</h1>
        <p className="text-muted-foreground text-sm mb-4">Verify student tokens at the pickup counter.</p>

        <div className="bg-accent rounded-full px-4 py-2 inline-flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-accent-foreground">Terminal Active</span>
        </div>

        {/* Token Scanner Area */}
        <div className="bg-card rounded-3xl p-6 border border-border card-shadow text-center mb-6">
          <h2 className="font-bold text-foreground mb-1">Token Lookup</h2>
          <p className="text-xs text-muted-foreground mb-6">Tap to simulate scan, or enter token manually</p>

          {/* Simulated Camera View */}
          <div
            onClick={simulateScan}
            className={`w-full aspect-[4/3] bg-zinc-900 rounded-2xl flex items-center justify-center relative overflow-hidden cursor-pointer mb-6 border border-border/50 transition ${scanning ? "opacity-70" : ""}`}
          >
            <div className="absolute inset-8 border-2 border-primary/40 rounded-2xl" />
            <div className="absolute inset-x-8 h-0.5 bg-primary/60 shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-scan-line" style={{ top: "40%" }} />
            <div className="absolute top-4 left-4 flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Live Capture</div>
            </div>
            {scanning ? (
              <p className="text-white/60 text-sm font-bold z-10">Scanning...</p>
            ) : (
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest z-10">Tap to Simulate Scan</p>
            )}
          </div>

          {/* Manual Token Input */}
          <div className="flex gap-2">
            <input
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchByToken()}
              placeholder="Enter token (e.g. 108 or #TK-108)"
              className="flex-1 h-11 px-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm"
            />
            <button onClick={searchByToken} className="px-4 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm btn-press">Search</button>
          </div>
        </div>

        {/* Order Found */}
        {scannedOrder && (
          <div className="bg-card rounded-3xl p-6 border-2 border-primary/20 card-shadow animate-slide-up mb-4">
            <div className="absolute top-0 right-0" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1">Token</p>
                <h3 className="text-3xl font-black text-foreground tracking-tighter">{scannedOrder.token}</h3>
              </div>
              <button onClick={reset} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Student</p>
                <p className="font-semibold text-foreground">{scannedOrder.student}</p>
                <p className="text-[10px] text-muted-foreground">{scannedOrder.studentEmail}</p>
              </div>
            </div>

            <div className="bg-muted/60 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Order Items</p>
              <p className="text-sm text-foreground font-medium leading-relaxed">{scannedOrder.items}</p>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-bold">{scannedOrder.total}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Placed at</span>
              <span className="font-medium">{scannedOrder.timestamp}</span>
            </div>

            <div className={`rounded-xl p-2 text-center mb-4 text-xs font-bold uppercase ${scannedOrder.status === "Ready" ? "bg-primary/10 text-primary" : scannedOrder.status === "Completed" ? "bg-green-500/10 text-green-500" : "bg-warning/10 text-warning"}`}>
              Status: {scannedOrder.status}
            </div>

            <div className="flex gap-3">
              {scannedOrder.status === "Preparing" && (
                <button onClick={readyOrder} className="flex-1 h-12 rounded-2xl bg-primary/15 text-primary font-bold text-sm btn-press flex items-center justify-center gap-2">
                  Mark Ready
                </button>
              )}
              {scannedOrder.status !== "Completed" && (
                <button onClick={completeOrder} className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm btn-press hover:opacity-90 transition flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Complete
                </button>
              )}
              {scannedOrder.status === "Completed" && (
                <div className="flex-1 h-12 rounded-2xl bg-green-500/10 text-green-500 font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Order Collected ✓
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminScannerPage;
