import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be under 255 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be under 1000 characters"),
});

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const iconMap = {
    Github,
    Linkedin,
    Instagram,
    Facebook,
    Mail,
  } as const;

  const emailLink = socialLinks.find((link) => link.name === "Email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setValidationErrors(errors);
      return;
    }

    setStatus("loading");

    try {
      const validated = result.data;
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "aaa42eee-7b7e-47c0-ae6e-45c60d2fde6e", // Replace with your Web3Forms access key
          name: validated.name,
          email: validated.email,
          message: validated.message,
          from_name: "It'z RJ Portfolio",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8" ref={ref}>
        <motion.p
          className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Let's connect
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-display font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Get In <span className="gradient-text">Touch</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-center max-w-md mx-auto mb-14 text-sm"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
        >
          Have a project in mind or just want to say hi? Drop me a message and I'll get back to you.
        </motion.p>

        <div className="max-w-2xl mx-auto grid md:grid-cols-5 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="md:col-span-3 glass-card p-8 rounded-2xl space-y-5"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setValidationErrors((prev) => { const { name, ...rest } = prev; return rest; }); }}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border ${validationErrors.name ? 'border-destructive' : 'border-border'} text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow`}
                required
                maxLength={100}
              />
              {validationErrors.name && <p className="text-destructive text-xs mt-1">{validationErrors.name}</p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setValidationErrors((prev) => { const { email, ...rest } = prev; return rest; }); }}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border ${validationErrors.email ? 'border-destructive' : 'border-border'} text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow`}
                required
                maxLength={255}
              />
              {validationErrors.email && <p className="text-destructive text-xs mt-1">{validationErrors.email}</p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Message</label>
              <textarea
                placeholder="Tell me about your project..."
                rows={4}
                value={form.message}
                onChange={(e) => { setForm({ ...form, message: e.target.value }); setValidationErrors((prev) => { const { message, ...rest } = prev; return rest; }); }}
                className={`w-full px-4 py-3 rounded-lg bg-secondary border ${validationErrors.message ? 'border-destructive' : 'border-border'} text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-shadow`}
                required
                maxLength={1000}
              />
              {validationErrors.message && <p className="text-destructive text-xs mt-1">{validationErrors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : status === "success" ? (
                <><CheckCircle className="w-4 h-4" /> Sent Successfully!</>
              ) : status === "error" ? (
                <><AlertCircle className="w-4 h-4" /> Failed — Try Again</>
              ) : (
                <>Send Message <Send className="w-4 h-4" /></>
              )}
            </button>
          </motion.form>

          {/* Info sidebar */}
          <motion.div
            className="md:col-span-2 flex flex-col gap-6 justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card p-5 rounded-2xl">
              <MapPin className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <p className="text-foreground text-sm">Dhaka, Bangladesh</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <Mail className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              {emailLink && (
                <a
                  href={emailLink.url}
                  className="text-foreground text-sm hover:text-primary transition-colors"
                >
                  {emailLink.url.replace("mailto:", "")}
                </a>
              )}
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <p className="text-xs text-muted-foreground mb-3">Follow me</p>
              <div className="flex gap-3">
                {socialLinks
                  .filter((link) => link.name !== "Email")
                  .map((link) => {
                    const Icon = iconMap[link.icon as keyof typeof iconMap];
                    if (!Icon) return null;

                    return (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
