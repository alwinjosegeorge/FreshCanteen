import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-8 pb-4">
        <span className="flex items-center gap-2">
          <span className="text-primary text-2xl">🌿</span>
          <span className="font-bold text-xl text-primary">FreshCanteen</span>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl card-shadow p-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-1 mb-8">Log in to your Smart Canteen account</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                  <button className="text-xs font-semibold text-primary hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Link
                to="/menu"
                className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg btn-press hover:opacity-90 transition"
              >
                Login <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <span className="text-muted-foreground text-sm">Don't have an account? </span>
              <button className="text-primary font-semibold text-sm hover:underline">Sign Up</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-card rounded-xl p-4 card-shadow flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">⚡</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Queue Sync</p>
                <p className="text-sm font-medium text-foreground">Live wait times</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 card-shadow flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">🔥</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nutrition</p>
                <p className="text-sm font-medium text-foreground">Macros tracked</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 pb-8">POWERED BY SMART CANTEEN ECOSYSTEM</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
