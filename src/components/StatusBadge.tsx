const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground",
  preparing: "bg-warning/15 text-warning-foreground",
  ready: "bg-accent text-accent-foreground",
  completed: "bg-accent text-accent-foreground",
  "out of stock": "bg-destructive/10 text-destructive",
};

export const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusStyles[s] || "bg-muted text-muted-foreground"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s === "completed" || s === "ready" ? "bg-primary" : s === "pending" || s === "preparing" ? "bg-warning" : "bg-destructive"}`} />
      {status}
    </span>
  );
};
