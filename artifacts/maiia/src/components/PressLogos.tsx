import { FadeIn } from './Animations';

const outlets = [
  { name: 'Architectural Digest', abbr: 'AD' },
  { name: 'Veranda', abbr: 'Veranda' },
  { name: 'ELLE Decor', abbr: 'ELLE Décor' },
  { name: 'House Beautiful', abbr: 'House Beautiful' },
  { name: 'Town & Country', abbr: 'Town & Country' },
];

export function PressLogos({ locale = 'en' }: { locale?: 'en' | 'ru' }) {
  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container mx-auto px-6">
        <FadeIn>
          <p className="text-center text-xs tracking-[0.3em] uppercase text-foreground/40 mb-12">
            {locale === 'en' ? 'As seen in' : 'Публикации в'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {outlets.map((outlet) => (
              <span
                key={outlet.name}
                className="font-serif text-lg md:text-xl text-foreground/25 hover:text-foreground/70 transition-colors duration-500 cursor-default select-none tracking-wide"
              >
                {outlet.abbr}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
