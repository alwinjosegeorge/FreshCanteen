import { useState } from "react";
import { Flashlight, SwitchCamera, CheckCircle2, User } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

const AdminScannerPage = () => {
  const [scanned, setScanned] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground">QR Scanner</h1>
        <p className="text-muted-foreground text-sm mb-4">Scan order QR codes to facilitate quick pickups.</p>

        <div className="bg-accent rounded-full px-4 py-2 inline-flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-accent-foreground">System Live</span>
        </div>

        <div className="bg-card rounded-2xl p-6 card-shadow text-center mb-4">
          <h2 className="font-bold text-foreground mb-1">Scan QR Code for Pickup</h2>
          <p className="text-sm text-muted-foreground mb-4">Align the QR code within the frame to detect automatically</p>

          <div
            onClick={() => setScanned(true)}
            className="w-full aspect-[4/3] bg-foreground/90 rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer mb-4"
          >
            <div className="absolute inset-8 border-2 border-primary/60 rounded-xl" />
            <div className="absolute inset-8 border-t-2 border-primary animate-pulse" style={{ top: "40%" }} />
            <p className="text-primary-foreground/60 text-sm z-10">Tap to simulate scan</p>
          </div>

          <div className="flex justify-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-medium btn-press">
              <Flashlight className="w-4 h-4" /> Flash
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-medium btn-press">
              <SwitchCamera className="w-4 h-4" /> Switch
            </button>
          </div>
        </div>

        {scanned && (
          <>
            <div className="bg-accent rounded-2xl p-4 flex items-center gap-3 mb-4 animate-slide-up">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">Scan Successful!</p>
                <p className="text-xs text-muted-foreground">Order details retrieved for Token #248</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 card-shadow animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Currently Scanning</p>
                  <h3 className="text-xl font-bold text-foreground">Order Details</h3>
                </div>
                <span className="text-sm font-bold text-primary bg-accent px-3 py-1 rounded-lg">#248</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Student Name</p>
                  <p className="font-semibold text-foreground">Alex Thompson</p>
                </div>
              </div>

              <p className="text-sm font-semibold text-foreground mb-2">Order Items</p>
              <div className="space-y-2 mb-4">
                {[
                  { qty: 1, name: "Grilled Chicken Pesto Wrap", price: "$8.50" },
                  { qty: 1, name: "Fresh Mango Smoothie", price: "$4.25" },
                ].map((i) => (
                  <div key={i.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{i.qty}</span>
                    <span className="flex-1 text-sm text-foreground">{i.name}</span>
                    <span className="text-sm font-medium">{i.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Total Amount Paid</span>
                  <span className="font-bold">$12.75</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-semibold">Status</span>
                  <span className="text-primary font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Payment Verified</span>
                </div>
              </div>

              <button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 btn-press hover:opacity-90 transition">
                <CheckCircle2 className="w-5 h-5" /> Mark as Completed
              </button>
            </div>

            <div className="mt-4 bg-warning/10 rounded-2xl p-4 flex items-start gap-3 mb-4">
              <span className="text-warning text-lg">⚠️</span>
              <div>
                <p className="font-semibold text-foreground text-sm">Scan Note</p>
                <p className="text-xs text-muted-foreground">Please verify student ID before handing over the order.</p>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav variant="admin" />
    </div>
  );
};

export default AdminScannerPage;
