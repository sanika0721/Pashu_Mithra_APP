import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { farmer } from "@/lib/data";
import { useFarm, useLive } from "@/lib/store";

const primaryNav = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/animals", label: "Animals", icon: "🐮" },
  { to: "/health", label: "Health", icon: "🩺" },
  { to: "/feeding", label: "Feeding", icon: "🌾" },
  { to: "/milk", label: "Milk", icon: "🥛" },
  { to: "/ai", label: "AI Mitra", icon: "✨" },
] as const;

const moreNav = [
  { to: "/iot", label: "IoT monitoring", icon: "📡" },
  { to: "/reproduction", label: "Breeding", icon: "🍼" },
  { to: "/alerts", label: "Alerts", icon: "🔔" },
  { to: "/vets", label: "Veterinarians", icon: "🩹" },
  { to: "/vet", label: "Vet dashboard", icon: "🧑‍⚕️" },
  { to: "/admin", label: "Admin", icon: "🛠️" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { alerts } = useFarm();
  const live = useLive();
  const open = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pt-5 pb-4 sm:px-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-leaf text-2xl">🐄</span>
          <span>
            <span className="block font-display text-xl leading-none">GauCare</span>
            <span className="block text-xs font-extrabold text-muted-foreground">
              {farmer.farmName} · {farmer.taluk}, {farmer.state}
            </span>
          </span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/20 bg-mint/60 px-3 py-1.5 text-xs font-extrabold text-leaf">
            <span className={cn("size-2 rounded-full bg-leaf", live && "animate-pulse")} />
            {live ? "Live · synced" : "Synced"}
          </span>
          <Link
            to="/alerts"
            className="rounded-full border border-peach/40 bg-butter/70 px-3 py-1.5 text-xs font-extrabold"
          >
            🔔 {open}
          </Link>
          <span className="grid size-9 place-items-center rounded-full bg-blossom text-sm font-extrabold">
            RS
          </span>
        </div>
      </header>

      <nav className="mx-auto max-w-7xl px-4 pb-3 sm:px-5">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-full border border-border bg-card/70 p-1.5 shadow-sm">
          {primaryNav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-extrabold whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : item.to === "/ai"
                      ? "bg-lilac/50"
                      : "text-muted-foreground hover:bg-secondary",
                )}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
          <span className="mx-1 h-6 w-px bg-border" />
          {moreNav.map((item) => {
            const active = path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-extrabold whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pb-28 sm:px-5 lg:pb-10">{children}</main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-6">
          {primaryNav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[10px] font-extrabold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
