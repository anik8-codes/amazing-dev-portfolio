import { TechMark } from '@/components/skills/TechMark';
import { tech, type TechName } from '@/config/tech';

/** The technologies used in a role: real logo (in its brand colour) + name, as small chips. */
export function TechChips({ names }: { names: readonly TechName[] }) {
  return (
    <ul aria-label="tech used" className="flex flex-wrap gap-2">
      {names.map((n) => {
        const t = tech[n];
        return (
          <li
            key={n}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-haze bg-white py-1 pr-3 pl-2 text-xs font-semibold"
          >
            <TechMark id={n} className="size-4 shrink-0" />
            {t.label}
          </li>
        );
      })}
    </ul>
  );
}
