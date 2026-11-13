export default function Loading() {
  return (
    <div
      className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4"
      role="status"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
