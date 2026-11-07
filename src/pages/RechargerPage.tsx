import { Zap } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function RechargerPage() {
  return (
    <div className="px-4 py-10">
      <Reveal>
        <h1 className="text-3xl font-extrabold text-ink">Recharger</h1>
      </Reveal>

      <Reveal index={1}>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center rounded-3xl bg-white/70 px-6 py-12 text-center shadow-soft backdrop-blur">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-rose-600">
            <Zap className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold text-ink">Aucune recharge disponible pour le moment</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-ink/60">
            La gestion des recharges sera prise en charge par le service backend.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
