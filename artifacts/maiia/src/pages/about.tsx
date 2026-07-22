import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';

export default function About() {
  const { locale } = useLocale();

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-serif mb-10 leading-tight">
              {locale === 'en' ? 'Crafting calm, collected spaces.' : 'Создавая спокойные, собранные пространства.'}
            </h1>
            <div className="space-y-6 text-lg font-light text-foreground/80 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <p>
                    Maiia Vilhelmsons is a boutique interior architecture and design studio specializing in luxury residential projects across the Hamptons and Manhattan.
                  </p>
                  <p>
                    Our philosophy is rooted in the belief that luxury is found in restraint. We create environments that whisper rather than shout—spaces characterized by natural light, tactile materials, and uncompromising attention to detail.
                  </p>
                  <p>
                    Each project is a deeply personal collaboration with our clients, resulting in homes that feel both curated and effortless, sophisticated yet entirely livable.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Maiia Vilhelmsons — это бутик-студия архитектуры и дизайна интерьера, специализирующаяся на элитных жилых проектах в Хэмптонс и на Манхэттене.
                  </p>
                  <p>
                    Наша философия основана на убеждении, что истинная роскошь кроется в сдержанности. Мы создаем пространства, которые говорят шепотом, а не кричат — интерьеры, отличающиеся естественным светом, тактильными материалами и бескомпромиссным вниманием к деталям.
                  </p>
                  <p>
                    Каждый проект — это глубоко личное сотрудничество с нашими клиентами, в результате которого рождаются дома, сочетающие в себе продуманность и легкость, утонченность и абсолютный комфорт.
                  </p>
                </>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="aspect-[3/4] bg-muted w-full overflow-hidden">
              <img src="/images/journal-2.jpg" alt="Studio details" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn className="order-2 lg:order-1">
            <div className="aspect-square bg-muted w-full overflow-hidden">
              <img src="/images/journal-1.jpg" alt="Maiia Vilhelmsons" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="order-1 lg:order-2">
            <h2 className="text-3xl font-serif mb-2">Maiia Vilhelmsons</h2>
            <p className="text-sm tracking-widest uppercase text-accent mb-8">Principal Designer</p>
            <div className="space-y-6 text-lg font-light text-foreground/80 leading-relaxed">
              {locale === 'en' ? (
                <p>
                  With over a decade of experience designing high-end properties along the East Coast, Maiia brings a refined eye and rigorous architectural approach to every project. Her background in both classical architecture and contemporary design allows her to create spaces that honor their context while embracing modern living.
                </p>
              ) : (
                <p>
                  Обладая более чем десятилетним опытом проектирования элитной недвижимости на Восточном побережье, Майя привносит в каждый проект утонченный вкус и строгий архитектурный подход. Ее бэкграунд как в классической архитектуре, так и в современном дизайне позволяет ей создавать пространства, которые уважают свой контекст, оставаясь при этом современными и удобными для жизни.
                </p>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}