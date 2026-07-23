import { Link } from 'wouter';
import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';
import { ArrowRight } from 'lucide-react';

const awards = [
  { year: '2024', en: 'Architectural Digest — Top 100 Interior Designers', ru: 'Architectural Digest — 100 лучших дизайнеров интерьера' },
  { year: '2023', en: 'Veranda — Designer of the Year, Finalist', ru: 'Veranda — Дизайнер года, финалист' },
  { year: '2023', en: 'ELLE Decor — A-List Designers', ru: 'ELLE Decor — A-List дизайнеров' },
  { year: '2022', en: 'House Beautiful — Next Wave Designer', ru: 'House Beautiful — Дизайнер волны' },
  { year: '2021', en: 'Hamptons Cottages & Gardens — Best Interior', ru: 'Hamptons Cottages & Gardens — Лучший интерьер' },
  { year: '2020', en: 'Town & Country — Top Designers to Watch', ru: 'Town & Country — Дизайнеры, за которыми стоит следить' },
];

const team = [
  { nameEn: 'Maiia Vilhelmsons', nameRu: 'Майя Вильхельмсонс', roleEn: 'Principal Designer & Founder', roleRu: 'Главный дизайнер и основатель', img: '/images/journal-1.jpg' },
  { nameEn: 'Eloise Carter', nameRu: 'Элоиза Картер', roleEn: 'Senior Interior Designer', roleRu: 'Старший дизайнер интерьера', img: '/images/project-2.jpg' },
  { nameEn: 'Marcus Holt', nameRu: 'Маркус Холт', roleEn: 'Project Architect', roleRu: 'Архитектор проектов', img: '/images/project-3.jpg' },
];

export default function About() {
  const { locale, t } = useLocale();

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Hero Statement */}
        <FadeIn>
          <div className="max-w-4xl mb-32">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-8">
              {locale === 'en' ? 'The Studio' : 'Студия'}
            </p>
            <h1 className="text-5xl md:text-7xl font-serif mb-12 leading-tight">
              {locale === 'en'
                ? 'Crafting calm, collected spaces.'
                : 'Создаём спокойные, собранные пространства.'}
            </h1>
          </div>
        </FadeIn>

        {/* Studio Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <FadeIn>
            <div className="space-y-6 text-lg font-light text-foreground/75 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <p>
                    Maiia Vilhelmsons is a boutique interior architecture and design studio specialising in luxury residential projects across the Hamptons and Manhattan. Founded in 2012, the studio has completed over sixty projects ranging from historic Shingled cottages to new-build oceanfront estates.
                  </p>
                  <p>
                    Our philosophy is rooted in the belief that luxury is found in restraint. We create environments that whisper rather than shout — spaces characterised by natural light, tactile materials, and uncompromising attention to detail.
                  </p>
                  <p>
                    Each project is a deeply personal collaboration with our clients, resulting in homes that feel both curated and effortless, sophisticated yet entirely livable.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Maiia Vilhelmsons — это бутик-студия архитектуры и дизайна интерьера, специализирующаяся на элитных жилых проектах в Хэмптонс и на Манхэттене. Основанная в 2012 году, студия реализовала более шестидесяти проектов — от исторических коттеджей до новых поместий у океана.
                  </p>
                  <p>
                    Наша философия основана на убеждении, что истинная роскошь кроется в сдержанности. Мы создаём пространства, которые говорят шёпотом, а не кричат — интерьеры, определённые естественным светом, тактильными материалами и бескомпромиссным вниманием к деталям.
                  </p>
                  <p>
                    Каждый проект — это глубоко личное сотрудничество с нашими клиентами, в результате которого рождаются дома, сочетающие продуманность и лёгкость, утонченность и абсолютный комфорт.
                  </p>
                </>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <img src="/images/journal-2.jpg" alt="Maiia Vilhelmsons studio" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </FadeIn>
        </div>

        {/* Principal Designer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <FadeIn className="order-2 lg:order-1">
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <img src="/images/journal-1.jpg" alt="Maiia Vilhelmsons" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="order-1 lg:order-2">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">
              {locale === 'en' ? 'Principal Designer' : 'Главный дизайнер'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif mb-8">Maiia Vilhelmsons</h2>
            <div className="space-y-5 text-lg font-light text-foreground/75 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <p>
                    With over a decade of experience designing high-end properties along the East Coast, Maiia brings a refined eye and rigorous architectural approach to every project.
                  </p>
                  <p>
                    Her background spans classical architecture training in Stockholm, postgraduate work at Parsons School of Design in New York, and a formative tenure at a Hamptons firm before establishing her own practice.
                  </p>
                  <p>
                    Maiia approaches every home as a study in how people actually live — not as a backdrop for photography, but as a place whose surfaces, light, and objects are encountered daily.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Обладая более чем десятилетним опытом проектирования элитной недвижимости на Восточном побережье, Майя привносит в каждый проект утонченный вкус и строгий архитектурный подход.
                  </p>
                  <p>
                    Её бэкграунд охватывает классическую архитектурную подготовку в Стокгольме, последипломное обучение в Школе дизайна Парсонс в Нью-Йорке и формирующий период в хэмптонской фирме перед основанием собственной студии.
                  </p>
                  <p>
                    Майя подходит к каждому дому как к исследованию того, как люди на самом деле живут — не как к декорации для фотографии, а как к месту, поверхности, свет и предметы которого встречаются ежедневно.
                  </p>
                </>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Team */}
        <div className="mb-32">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif mb-16">
              {locale === 'en' ? 'The Team' : 'Команда'}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <FadeIn key={member.nameEn} delay={idx * 0.08}>
                <div>
                  <div className="aspect-[3/4] bg-muted overflow-hidden mb-6">
                    <img
                      src={member.img}
                      alt={locale === 'en' ? member.nameEn : member.nameRu}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-serif text-xl mb-1">{locale === 'en' ? member.nameEn : member.nameRu}</h3>
                  <p className="text-xs tracking-widest uppercase text-foreground/50">
                    {locale === 'en' ? member.roleEn : member.roleRu}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Awards & Press */}
        <div className="mb-24">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif mb-16">
              {locale === 'en' ? 'Awards & Press' : 'Награды и публикации'}
            </h2>
          </FadeIn>
          <div className="space-y-0">
            {awards.map((award, idx) => (
              <FadeIn key={idx} delay={idx * 0.04}>
                <div className="flex items-baseline gap-8 py-6 border-b border-border last:border-0">
                  <span className="text-sm text-foreground/30 font-light w-12 flex-shrink-0">{award.year}</span>
                  <span className="text-lg font-light text-foreground/80">
                    {locale === 'en' ? award.en : award.ru}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA */}
        <FadeIn>
          <div className="border-t border-border pt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors">
              {t('home.cta')} <ArrowRight size={14} />
            </Link>
            <Link href={`/${locale}/portfolio`} className="text-foreground/50 hover:text-foreground transition-colors text-sm uppercase tracking-widest">
              {t('general.all_projects')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
