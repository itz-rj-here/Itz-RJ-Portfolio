import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FolderGit2,
  Award,
  Cpu,
  User,
  Share2,
  LogOut,
  ExternalLink,
  RotateCcw,
  KeyRound,
  LoaderCircle,
  X,
  Check,
} from "lucide-react";
import {
  checkAdminSession,
  logoutAdmin,
  updateSupabasePassword,
  supabase,
} from "@/lib/supabase";
import { usePortfolioData, usePortfolioMutations } from "@/hooks/use-portfolio";
import { ProjectsManager } from "@/components/dashboard/ProjectsManager";
import { CertificatesManager } from "@/components/dashboard/CertificatesManager";
import { SkillsManager } from "@/components/dashboard/SkillsManager";
import { AboutManager } from "@/components/dashboard/AboutManager";
import { SocialsManager } from "@/components/dashboard/SocialsManager";
import { toast } from "sonner";

type DashboardTab = "projects" | "certificates" | "skills" | "about" | "socials";

const Dashboard = () => {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("projects");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const { data } = usePortfolioData();
  const { resetPortfolio } = usePortfolioMutations();

  useEffect(() => {
    checkAdminSession().then(({ authenticated, email }) => {
      if (!authenticated) {
        navigate("/login", { replace: true });
      } else {
        if (email) setAdminEmail(email);
        setAuthChecking(false);
      }
    });

    if (supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/login", { replace: true });
        } else if (session.user?.email) {
          setAdminEmail(session.user.email);
        }
      });
      return () => {
        listener.subscription.unsubscribe();
      };
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logoutAdmin();
    toast.success("Signed out of Supabase session");
    navigate("/login", { replace: true });
  };

  const handleResetData = async () => {
    try {
      await resetPortfolio.mutateAsync();
      setShowResetConfirm(false);
      toast.success("Portfolio data restored to original pre-seeded state");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reset data");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await updateSupabasePassword(newPassword);
      setShowPasswordModal(false);
      setNewPassword("");
      toast.success("Supabase account password updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderCircle className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  const totalSkills = data.skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

  const navItems: { id: DashboardTab; label: string; count: number; icon: typeof FolderGit2 }[] = [
    { id: "projects", label: "Projects", count: data.projects.length, icon: FolderGit2 },
    { id: "certificates", label: "Certificates", count: data.certificates.length, icon: Award },
    { id: "skills", label: "Skills", count: totalSkills, icon: Cpu },
    {
      id: "about",
      label: "About & Images",
      count: data.about.aboutImages.length,
      icon: User,
    },
    { id: "socials", label: "Contact & Socials", count: data.socialLinks.length, icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <Helmet>
        <title>Dashboard | It'z RJ Portfolio Studio</title>
      </Helmet>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card/70 border-b md:border-b-0 md:border-r border-border shrink-0 flex flex-col justify-between">
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-display font-bold gradient-text">It'z RJ Studio</span>
              <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                {adminEmail}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active ? "text-primary-foreground/90" : "text-muted-foreground"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2 hidden md:block">
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-3.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center gap-2 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" /> Change Password
          </button>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-3.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore Default Seed
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-3.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract */}
        <header className="h-16 px-6 border-b border-border bg-card/40 flex items-center justify-between gap-8 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
            <span className="font-medium text-foreground">Portfolio CMS</span>
            <span>/</span>
            <span className="capitalize text-primary font-medium">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              View Live Portfolio <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="md:hidden px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-destructive whitespace-nowrap shrink-0"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Workspace Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Metric Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/40">
              <p className="text-xs text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-display font-bold text-foreground font-mono tabular-nums mt-1">
                {data.projects.length}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/40">
              <p className="text-xs text-muted-foreground">Certificates Earned</p>
              <p className="text-2xl font-display font-bold text-foreground font-mono tabular-nums mt-1">
                {data.certificates.length}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/40">
              <p className="text-xs text-muted-foreground">Active Skills</p>
              <p className="text-2xl font-display font-bold text-foreground font-mono tabular-nums mt-1">
                {totalSkills}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/40">
              <p className="text-xs text-muted-foreground">About Carousel Photos</p>
              <p className="text-2xl font-display font-bold text-foreground font-mono tabular-nums mt-1">
                {data.about.aboutImages.length}
              </p>
            </div>
          </div>

          {/* Active Manager View */}
          {activeTab === "projects" && <ProjectsManager projects={data.projects} />}
          {activeTab === "certificates" && (
            <CertificatesManager certificates={data.certificates} />
          )}
          {activeTab === "skills" && (
            <SkillsManager skillCategories={data.skillCategories} />
          )}
          {activeTab === "about" && <AboutManager about={data.about} />}
          {activeTab === "socials" && (
            <SocialsManager
              socialLinks={data.socialLinks}
              location={data.about.location}
            />
          )}
        </main>
      </div>

      {/* Update Supabase Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-display font-bold text-foreground">
                Change Supabase Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Signed-in Account
                </label>
                <input
                  type="email"
                  disabled
                  value={adminEmail}
                  className="w-full px-3.5 py-2 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new Supabase password"
                  className="w-full px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restore Default Seed Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-display font-bold text-foreground">
              Restore Original Portfolio Data?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will reset all projects, certificates, skills, and About images back to the initial pre-seeded portfolio items.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
