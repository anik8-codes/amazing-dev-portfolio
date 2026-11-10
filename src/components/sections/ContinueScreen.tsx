import { ControllerButton } from '@/components/pixel/ControllerButton';
import { continueScreen as c } from '@/config/scores';
import { Countdown } from './Countdown';

/**
 * The arcade "CONTINUE?" screen before the footer, with the booking call-to-action.
 * The call-to-action stays available throughout the optional countdown.
 */
export function ContinueScreen() {
  return (
    <section
      aria-labelledby="continue-title"
      className="defer-render px-4 py-24 text-center"
      style={{ '--deferred-height': '600px' } as React.CSSProperties}
    >
      <h2 id="continue-title" className="font-display text-pixel-24 uppercase sm:text-pixel-32">
        {c.title}
      </h2>
      <Countdown />
      <p className="mx-auto mt-8 max-w-md text-lg text-muted">{c.line}</p>
      <div className="mt-10">
        <ControllerButton letter="A" href={c.cta.href} sfx="start">
          {c.cta.label}
        </ControllerButton>
      </div>
    </section>
  );
}
