import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Animal, HealthStatus, Severity } from "@/lib/data";

export const severityStyles: Record<Severity, { dot: string; chip: string; btn: string; label: string }> =
  {
    ok: {
      dot: "bg-leaf",
      chip: "bg-mint/50 text-leaf border-leaf/20",
      btn: "bg-leaf text-primary-foreground",
      label: "Normal",
    },
    attention: {
      dot: "bg-butter",
      chip: "bg-butter/50 text-foreground border-butter",
      btn: "bg-butter text-foreground",
      label: "Attention",
    },
    warning: {
      dot: "bg-peach",
      chip: "bg-peach/50 text-foreground border-peach",
      btn: "bg-peach text-foreground",
      label: "Warning",
    },
    critical: {
      dot: "bg-coral",
      chip: "bg-coral/20 text-coral border-coral/30",
      btn: "bg-coral text-primary-foreground",
      label: "Critical",
    },
  };

export const healthSeverity = (h: HealthStatus): Severity =>
  h === "critical" ? "critical" : h === "at_risk" ? "warning" : "ok";

export const healthLabel: Record<HealthStatus, string> = {
  healthy: "Healthy",
  at_risk: "Needs attention",
  critical: "Critical",
};

export function Chip({
  severity = "ok",
  children,
  className,
}: {
  severity?: Severity;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap",
        severityStyles[severity].chip,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ severity = "ok", pulse }: { severity?: Severity; pulse?: boolean }) {
  return (
    <span
      className={cn(
        "size-3 shrink-0 rounded-full",
        severityStyles[severity].dot,
        pulse && "animate-pulse",
      )}
    />
  );
}

export function Card({
  children,
  className,
  as: As = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return <As className={cn("card-soft p-5", className)}>{children}</As>;
}

export function SectionHeading({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-display text-xl">{title}</h2>
      {action ?? (hint ? <span className="text-xs font-extrabold text-muted-foreground">{hint}</span> : null)}
    </div>
  );
}

export function Stat({
  value,
  label,
  tone = "plain",
}: {
  value: ReactNode;
  label: string;
  tone?: "plain" | "good" | "warn" | "bad" | "repro";
}) {
  const tones: Record<string, string> = {
    plain: "bg-card border-border",
    good: "bg-mint/40 border-leaf/20 text-leaf",
    warn: "bg-butter/40 border-peach/30",
    bad: "bg-coral/15 border-coral/30 text-coral",
    repro: "bg-lilac/40 border-lilac/60",
  };
  return (
    <div className={cn("rounded-2xl border p-3", tones[tone])}>
      <p className="font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-xs font-extrabold text-muted-foreground">{label}</p>
    </div>
  );
}

export function AnimalAvatar({ animal, size = 44 }: { animal: Animal; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-2xl text-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: `oklch(0.88 0.07 ${animal.photoHue})`,
      }}
      aria-hidden
    >
      {animal.species === "Buffalo" ? "🐃" : "🐄"}
    </span>
  );
}

/** Simple inline sparkline for temperature / yield trends. */
export function Sparkline({
  values,
  className,
  stroke = "var(--color-leaf)",
}: {
  values: number[];
  className?: string;
  stroke?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${30 - ((v - min) / span) * 26 - 2}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
      role="img"
      aria-label="Trend line"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function BarSeries({
  data,
  highlightLast,
  unit = "L",
}: {
  data: { label: string; value: number }[];
  highlightLast?: boolean;
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="mt-5 flex h-40 items-end justify-between gap-2">
      {data.map((d, i) => (
        <div key={d.label + i} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-extrabold text-muted-foreground">
            {d.value ? d.value.toFixed(0) : ""}
          </span>
          <div
            className={cn(
              "w-full rounded-t-xl",
              highlightLast && i === data.length - 1 ? "bg-butter" : "bg-skyblue",
            )}
            style={{ height: `${Math.max((d.value / max) * 100, 3)}%` }}
            title={`${d.label}: ${d.value} ${unit}`}
          />
          <span className="text-[10px] font-extrabold text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ActionButton({
  children,
  severity = "ok",
  to,
  onClick,
  className,
}: {
  children: ReactNode;
  severity?: Severity;
  to?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls = cn(
    "shrink-0 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-transform active:scale-95",
    severityStyles[severity].btn,
    className,
  );
  if (to)
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="card-soft flex flex-col items-center gap-2 p-10 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="font-display text-lg">{title}</p>
      {hint ? <p className="text-sm font-bold text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
