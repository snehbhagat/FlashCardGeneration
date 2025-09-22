export default function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="card-surface grid place-items-center p-10 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-secondary">⚡️</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-foreground/70">{subtitle}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
