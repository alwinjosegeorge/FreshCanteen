import { CheckCircle2, UtensilsCrossed, Bell, ClipboardCheck, Clock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import foodAvocadoBowl from "@/assets/food-avocado-bowl.jpg";
import foodGreenSmoothie from "@/assets/food-green-smoothie.jpg";

const steps = [
  { label: "Pending", time: "12:45 PM", icon: CheckCircle2, done: true },
  { label: "Preparing", time: "IN PROGRESS", icon: UtensilsCrossed, done: false, active: true },
  { label: "Ready", time: "", icon: Bell, done: false },
  { label: "Completed", time: "", icon: ClipboardCheck, done: false },
];

const OrderStatusPage = () => (
  <div className="min-h-screen bg-background pb-20">
    <AppHeader />
    <div className="px-4 pt-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Current Order</h1>
      <p className="text-muted-foreground text-sm mb-6">Order #FC-8829 • Placed at 12:45 PM</p>

      <div className="bg-card rounded-2xl p-6 card-shadow mb-6 animate-fade-in">
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.done ? "bg-primary text-primary-foreground" : step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {i < steps.length - 1 && <div className={`w-0.5 h-8 my-1 ${step.done ? "bg-primary" : "bg-border"}`} />}
              </div>
              <div className="pt-2">
                <p className={`font-semibold text-sm ${step.done || step.active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                {step.time && <p className={`text-xs ${step.active ? "text-primary font-semibold uppercase tracking-wide" : "text-muted-foreground"}`}>{step.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-lg font-bold text-foreground mb-3">Order Items</h2>
      <div className="space-y-3 mb-6">
        {[
          { name: "Quinoa Power Bowl", desc: "Extra avocado, No onions", price: 12.50, image: foodAvocadoBowl, tags: ["VEGAN", "GLUTEN-FREE"] },
          { name: "Green Detox Smoothie", desc: "Regular size, Low ice", price: 6.00, image: foodGreenSmoothie, tags: ["FRESH"] },
        ].map((item) => (
          <div key={item.name} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 animate-fade-in">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                <span className="font-bold text-primary text-sm">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
              <div className="flex gap-1.5 mt-1.5">
                {item.tags.map((t) => <span key={t} className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-5 card-shadow mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>$18.50</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Canteen Surcharge</span><span>$0.50</span></div>
          <div className="border-t border-border my-3" />
          <div className="flex justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Amount</p>
              <p className="text-2xl font-extrabold text-foreground">$19.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent rounded-2xl p-5 card-shadow flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">Estimated Pickup</p>
          <p className="font-bold text-foreground">1:05 PM — 1:15 PM</p>
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
);

export default OrderStatusPage;
