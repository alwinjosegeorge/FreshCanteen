import { useEffect, useRef, useState } from "react";
import { CheckCircle2, User, Camera, CameraOff, Search, Clock, Bell } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getStoredOrders, updateOrderStatus, Order } from "@/data/storage";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

const AdminScannerPage = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [scannedOrders, setScannedOrders] = useState<Order[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) { }
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      setIsScanning(true);

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await handleScannedResult(decodedText);
        },
        () => { } // Ignore continuous scan frame errors
      );
    } catch (err) {
      console.error("Scanner start error:", err);
      toast.error("Could not access camera. Please check browser permissions.");
      setIsScanning(false);
    }
  };

  const handleScannedResult = async (decodedText: string) => {
    try {
      const orders = await getStoredOrders();
      const activeOrders = orders.filter(o => o.status !== "Completed");

      let matchedOrders = activeOrders.filter(o => (o._id || o.id) === decodedText);

      // Match by Token or Admission Number
      if (matchedOrders.length === 0) {
        const q = decodedText.toLowerCase();
        matchedOrders = activeOrders.filter(o =>
          o.token.toLowerCase().includes(q) ||
          o.admissionNumber.toLowerCase() === q
        );
      }

      if (matchedOrders.length > 0) {
        setScannedOrders(matchedOrders);
        setShowSuccess(true);
        toast.success(`Found ${matchedOrders.length} active order(s)`);
        await stopScanner();
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        toast.error("No active orders found for this scan");
      }
    } catch (err) {
      toast.error("Error identifying scanned order");
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const searchByToken = async () => {
    if (!tokenInput.trim()) {
      toast.error("Enter a token or admission number");
      return;
    }
    const q = tokenInput.trim().toLowerCase();
    const orders = await getStoredOrders();
    const activeOrders = orders.filter(o => o.status !== "Completed");

    const matchedOrders = activeOrders.filter(o =>
      o.token.toLowerCase() === q ||
      o.token.toLowerCase().replace("#tk-", "") === q.replace("#tk-", "") ||
      o.admissionNumber.toLowerCase() === q
    );

    if (matchedOrders.length > 0) {
      setScannedOrders(matchedOrders);
      toast.success(`Found ${matchedOrders.length} active order(s)`);
      setTokenInput("");
    } else {
      toast.error(`No active orders found for "${tokenInput}"`);
      setScannedOrders([]);
    }
  };

  const completeOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "Completed");
    setScannedOrders(prev => prev.filter(o => (o._id || o.id) !== orderId));
    toast.success(`✅ Order marked as Completed!`);
  };

  const readyOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "Ready");
    setScannedOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: "Ready" } : o));
    toast.success(`Order is now Ready!`);
  };

  const reset = () => {
    setScannedOrders([]);
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
        <div className="bg-card rounded-3xl p-6 border border-border card-shadow text-center mb-6 relative">
          <h2 className="font-bold text-foreground mb-1">QR Pickup Scanner</h2>
          <p className="text-xs text-muted-foreground mb-6">Point camera at student's order QR code or ID relative</p>

          {/* Camera View Area */}
          <div className="relative mb-6 mx-auto w-full max-w-sm">
            <div className={`w-full aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden border-4 border-card transition-all duration-500 card-shadow relative ${isScanning ? "ring-4 ring-primary/20 scale-[1.02]" : "opacity-40"}`}>
              {/* html5-qrcode mounts here unconditionally */}
              <div id="reader" className="w-full h-full absolute inset-0 z-0 bg-black"></div>

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 bg-zinc-900 z-10">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Scanner Offline</p>
                </div>
              )}
            </div>

            {isScanning && (
              <>
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-square border-2 border-primary/60 rounded-3xl pointer-events-none z-10">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-3xl animate-pulse" />
                </div>
                {/* Scanning Line */}
                <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-scan-line z-20" style={{ top: "30%" }} />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Capture</span>
                  </div>
                </div>
              </>
            )}

            {/* Success Overlay */}
            {showSuccess && scannedOrders.length > 0 && (
              <div className="absolute inset-0 bg-primary/95 backdrop-blur-md z-40 rounded-3xl flex flex-col items-center justify-center animate-fade-in text-primary-foreground p-6">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 scale-up-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-1 text-center">Found {scannedOrders.length} Order(s)!</h3>
                <p className="text-sm opacity-90 mb-6 text-center">{scannedOrders[0].student}</p>
                <button onClick={() => setShowSuccess(false)} className="px-6 py-3 w-full rounded-xl bg-white text-primary font-bold text-sm shadow-lg active:scale-95 transition-transform">
                  View Orders
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={isScanning ? stopScanner : startScanner}
              className={`flex items-center gap-2 px-8 h-14 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 z-30 ${isScanning ? "bg-zinc-800 text-white border border-white/10" : "bg-primary text-primary-foreground"}`}
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-5 h-5" /> STOP SCANNER
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" /> START CAMERA
                </>
              )}
            </button>
          </div>

          {/* Manual Token Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchByToken()}
                placeholder="Enter token or Admission No."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm transition"
              />
            </div>
            <button onClick={searchByToken} className="px-5 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm btn-press">Search</button>
          </div>
        </div>

        {/* Orders Found */}
        {scannedOrders.length > 0 && (
          <div className="space-y-4 mb-4 animate-slide-up">
            <div className="flex justify-between items-center px-1 mb-2">
              <h3 className="font-bold text-foreground">Active Orders ({scannedOrders.length})</h3>
              <button onClick={reset} className="px-4 py-1.5 bg-muted rounded-xl text-xs font-bold text-muted-foreground hover:bg-border transition">Clear Results</button>
            </div>

            {scannedOrders.map((order, index) => (
              <div key={order._id || order.id || index} className="bg-card rounded-3xl p-6 border-2 border-primary/20 card-shadow relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.status === "Ready" ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}>
                      {order.status === "Ready" ? <Bell className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground tracking-tighter">{order.token}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Token Number</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{order.student}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{order.admissionNumber}</p>
                  </div>
                </div>

                <div className="bg-muted/60 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    Order Items <span className="w-4 h-[1px] bg-border flex-1"></span>
                  </p>
                  <p className="text-sm text-foreground font-medium leading-relaxed">{order.items}</p>
                </div>

                <div className="flex justify-between text-sm mb-1 px-1">
                  <span className="text-muted-foreground font-medium">Total Paid</span>
                  <span className="font-bold text-foreground">{order.total}</span>
                </div>
                <div className="flex justify-between text-sm mb-5 px-1">
                  <span className="text-muted-foreground font-medium">Placed at</span>
                  <span className="font-semibold text-foreground">{order.timestamp}</span>
                </div>

                <div className={`rounded-xl p-3 text-center mb-4 text-xs font-black uppercase tracking-widest ${order.status === "Ready" ? "bg-primary/10 text-primary border border-primary/20" : order.status === "Completed" ? "bg-green-500/10 text-green-500" : "bg-warning/10 text-warning border border-warning/20"}`}>
                  Status: {order.status}
                </div>

                <div className="flex gap-3">
                  {order.status === "Preparing" && (
                    <button onClick={() => readyOrder(order._id || order.id)} className="flex-1 h-12 rounded-2xl bg-primary/15 hover:bg-primary/25 text-primary font-bold text-sm btn-press flex items-center justify-center gap-2 transition-colors">
                      Mark Ready
                    </button>
                  )}
                  {order.status !== "Completed" && (
                    <button onClick={() => completeOrder(order._id || order.id)} className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm btn-press shadow-[0_8px_20px_-8px_rgba(var(--primary),0.6)] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Finish & Give
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminScannerPage;
