import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import favicon from "/src/images/PFP/logo.png";

const ensureFavicon = (href: string) => {
  const existing =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
    document.createElement("link");

  existing.rel = "icon";
  existing.type = "image/png";
  existing.href = href;

  if (!existing.parentNode) {
    document.head.appendChild(existing);
  }
};

ensureFavicon(favicon);

createRoot(document.getElementById("root")!).render(<App />);
