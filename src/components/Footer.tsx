const Footer = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-lg gradient-text">It'z RJ</p>
            <p className="text-muted-foreground text-sm mt-1">Building the future, one line at a time.</p>
          </div>

          <div className="flex gap-6">
            {["Home", "About", "Skills", "Portfolio", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(`#${item.toLowerCase()}`)}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} It'z RJ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
