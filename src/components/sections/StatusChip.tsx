import type { QuestStatus } from '@/config/quests';

const dot: Record<QuestStatus, string> = {
  shipped: 'bg-ink',
  'in progress': 'bg-orange animate-blink',
  stealth: 'bg-mist',
};

/** Small pixel chip: ● SHIPPED / IN PROGRESS / STEALTH. */
export function StatusChip({ status }: { status: QuestStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-2.5 py-1 font-display text-pixel-8 uppercase">
      <span aria-hidden className={`size-2 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}
