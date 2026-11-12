export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4">
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md border bg-background p-6 shadow-xl">
        <h2 id="confirm-title" className="display text-3xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} className="eyebrow min-h-11 border px-4 py-3">Cancel</button>
          <button type="button" onClick={onConfirm} className="eyebrow min-h-11 bg-destructive px-4 py-3 text-destructive-foreground">Delete</button>
        </div>
      </section>
    </div>
  );
}
