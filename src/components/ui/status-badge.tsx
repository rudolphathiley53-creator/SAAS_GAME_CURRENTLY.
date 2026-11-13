type StatusBadgeProps = {
  label: string;
  tone?: 'neutral' | 'warning' | 'success';
};

const toneClasses = {
  neutral: 'border-rose-200 bg-rose-50 text-rose-700',
  warning: 'border-coral-200 bg-coral-50 text-coral-600',
  success: 'border-rose-300 bg-rose-100 text-rose-700',
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
