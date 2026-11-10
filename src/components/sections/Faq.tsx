import { faq } from '@/config/faq';
import { Section } from './Section';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** FAQ: plain answers for people and AI assistants (native <details>, plus FAQPage JSON-LD). */
export function Faq() {
  return (
    <Section defer id="faq" stage="1-5" title="faq" kicker="the quick answers.">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl divide-y divide-haze border-y border-haze">
        {faq.map((f, i) => (
          <details key={f.q} open={i === 0} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
