import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, Mail, ArrowLeft, LoaderCircle, Eye, EyeOff, CircleAlert } from "lucide-react";
import { loginAdmin, checkAdminSession, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkAdminSession().then(({ authenticated }) => {
      if (authenticated) {
        navigate("/dashboard", { replace: true });
      } else {
        setCheckingSession(false);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your Supabase email and password");
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
      toast.success("Signed in with Supabase Auth");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid Supabase login credentials");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <LoaderCircle className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between gradient-bg relative overflow-hidden p-4 md:p-8">
      <Helmet>
        <title>Admin Login | It'z RJ Portfolio</title>
      </Helmet>

      {/* Top Back Bar */}
      <div className="container mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-12">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-3 text-primary">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Portfolio Studio Login
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in with your Supabase account to manage your portfolio.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-2.5 text-xs text-destructive-foreground">
              <CircleAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Supabase Environment Variables Missing</p>
                <p className="text-muted-foreground mt-0.5">
                  Set <code className="font-mono text-foreground">VITE_SUPABASE_URL</code> and{" "}
                  <code className="font-mono text-foreground">VITE_SUPABASE_ANON_KEY</code> in your environment to sign in with Supabase Auth.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Supabase password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In with Supabase"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground/60">
        Secured by Supabase Authentication
      </div>
    </div>
  );
};

export default Login;
