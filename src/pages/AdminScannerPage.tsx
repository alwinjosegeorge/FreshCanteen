import { useEffect, useRef, useState } from "react";
import { CheckCircle2, User, RotateCcw, Camera, CameraOff, Search } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getStoredOrders, updateOrderStatus, Order } from "@/data/storage";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

const AdminScannerPage = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
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
          // Scanned successfully
          await handleScannedResult(decodedText);
        },
        () => {
          // Error/Still scanning
        }
      );
    } catch (err) {
      console.error("Scanner start error:", err);
      toast.error("Could not access camera");
      setIsScanning(false);
    }
  };

  const handleScannedResult = async (decodedText: string) => {
    try {
      // The decoded text is expected to be the order ID (_id or id)
      const orders = await getStoredOrders();
      const found = orders.find(o => (o._id || o.id) === decodedText);

      if (found) {
        setScannedOrder(found);
        setTokenInput(found.token);
        toast.success(`Scanned: ${found.token}`);
        await stopScanner();
      } else {
        // Try fallback search by token if the scanned text is a token number
        const byToken = orders.find(o => o.token.includes(decodedText) || decodedText.includes(o.token));
        if (byToken) {
          setScannedOrder(byToken);
          setTokenInput(byToken.token);
          toast.success(`Found by token: ${byToken.token}`);
          await stopScanner();
        } else {
          toast.error("Order not found in database");
        }
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
      toast.error("Enter a token number first");
      return;
    }
    const q = tokenInput.includes("TK") ? tokenInput : `#TK-${tokenInput}`;
    const orders = await getStoredOrders();
    const found = orders.find(o => o.token.toLowerCase() === q.toLowerCase() || o.token.replace("#TK-", "") === tokenInput.replace("#TK-", ""));
    if (found) {
      setScannedOrder(found);
      toast.success(`Order found: ${found.token}`);
    } else {
      toast.error(`Token ${q} not found`);
      setScannedOrder(null);
    }
  };

  const completeOrder = async () => {
    if (!scannedOrder) return;
    await updateOrderStatus(scannedOrder._id || scannedOrder.id, "Completed");
    toast.success(`✅ Order ${scannedOrder.token} marked as Completed!`);
    setScannedOrder(null);
    setTokenInput("");
  };

  const readyOrder = async () => {
    if (!scannedOrder) return;
    await updateOrderStatus(scannedOrder._id || scannedOrder.id, "Ready");
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
          <h2 className="font-bold text-foreground mb-1">QR Pickup Scanner</h2>
          <p className="text-xs text-muted-foreground mb-6">Point camera at student's order QR code</p>

          {/* Camera View Area */}
          <div className="relative mb-6">
            <div
              id="reader"
              className={`w-full aspect-[4/3] bg-zinc-900 rounded-2xl overflow-hidden border border-border/50 transition ${isScanning ? "opacity-100" : "opacity-40"}`}
            >
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                  <Camera className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Camera Offline</p>
                </div>
              )}
            </div>

            {isScanning && (
              <div className="absolute inset-8 border-2 border-primary/40 rounded-2xl pointer-events-none" />
            )}

            <button
              onClick={isScanning ? stopScanner : startScanner}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 h-12 rounded-full font-bold text-sm shadow-xl transition-all btn-press ${isScanning ? "bg-destructive text-white" : "bg-primary text-primary-foreground"}`}
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-4 h-4" /> Stop Scanning
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" /> Start Camera
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
                placeholder="Enter token manually..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none text-sm transition"
              />
            </div>
            <button onClick={searchByToken} className="px-5 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm btn-press">Go</button>
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
                <p className="text-[10px] text-muted-foreground">{scannedOrder.admissionNumber}</p>
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
