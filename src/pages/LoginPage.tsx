import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User } from "lucide-react";
import { saveSession } from "@/data/storage";
import { toast } from "sonner";

const ADMIN_EMAIL = "admin@freshcanteen.com";
const ADMIN_PASS = "admin123";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isAdmin) {
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
          saveSession({ email, name: "Admin", role: "admin", id: "admin-001" });
          toast.success("Welcome, Admin!");
          navigate("/admin");
        } else {
          toast.error("Invalid admin credentials. Use admin@freshcanteen.com / admin123");
        }
      } else {
        if (email && password) {
          const name = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase());
          saveSession({ email, name, role: "student", id: "stu-" + Math.random().toString(36).substr(2, 6) });
          toast.success(`Welcome, ${name}!`);
          navigate("/menu");
        } else {
          toast.error("Please enter your email and password.");
        }
      }
      setLoading(false);
    }, 500);
  };

  const fillDemo = () => {
    if (isAdmin) {
      setEmail(ADMIN_EMAIL);
      setPassword(ADMIN_PASS);
    } else {
      setEmail("student@university.edu");
      setPassword("student123");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-8 pb-4">
        <span className="flex items-center gap-2">
          <span className="font-bold text-2xl text-foreground tracking-tight">🌿 FreshCanteen</span>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl card-shadow p-8 animate-fade-in">
            {/* Role Tabs */}
            <div className="flex bg-muted rounded-xl p-1 mb-8">
              <button
                onClick={() => setIsAdmin(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${!isAdmin ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <User className="w-3.5 h-3.5" /> STUDENT
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isAdmin ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> STAFF / ADMIN
              </button>
            </div>

            <h1 className="text-3xl font-extrabold text-foreground text-center tracking-tight">Canteen Login</h1>
            <p className="text-muted-foreground text-center mt-2 mb-8 text-sm">
              {isAdmin ? "Access the FreshCanteen administration panel" : "Access your FreshCanteen student account"}
            </p>

            {isAdmin && (
              <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-center text-muted-foreground">
                Admin: <strong className="text-foreground">admin@freshcanteen.com</strong> / <strong className="text-foreground">admin123</strong>
                <button onClick={fillDemo} className="ml-2 text-primary font-bold hover:underline">(fill)</button>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder={isAdmin ? "admin@freshcanteen.com" : "name@university.edu"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                  <button type="button" onClick={fillDemo} className="text-xs font-semibold text-primary hover:underline">Fill Demo</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg btn-press hover:opacity-90 transition shadow-lg shadow-primary/20 disabled:opacity-60"
              >
                {loading ? "Signing in..." : <>Login <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <span className="text-muted-foreground text-sm">New student? </span>
              <button onClick={() => { setEmail("newstudent@university.edu"); setPassword("pass123"); setIsAdmin(false); }} className="text-primary font-semibold text-sm hover:underline">Try Demo Account</button>
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

          <p className="text-center text-[10px] font-bold tracking-widest text-muted-foreground mt-8 pb-8 uppercase opacity-50">FreshCanteen Management System v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
