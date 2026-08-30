import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';
import { PressLogos } from '../components/PressLogos';
import { AboutDesigner } from '../components/AboutDesigner';
import { 
  useGetSiteSummary, 
  useListFeaturedProjects, 
  useListServices, 
  useListJournalPosts 
} from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  getHomepageContent,
  localizedHomepageField,
} from '../lib/homepage-content';

export default function Home() {
  const { locale, t, l } = useLocale();

  const { data: summary } = useGetSiteSummary();
  const { data: featuredProjects } = useListFeaturedProjects();
  const { data: services } = useListServices();
  const { data: journalPosts } = useListJournalPosts();
  const { data: homepage } = useQuery({
    queryKey: ['homepage'],
    queryFn: getHomepageContent,
  });

  const heroImage = homepage?.heroImage || '/images/hero.jpg';
  const heroEyebrow = localizedHomepageField(
    homepage,
    locale,
    'heroEyebrow',
    'Interior Architecture & Design · New York',
  );
  const heroHeadline = localizedHomepageField(
    homepage,
    locale,
    'heroHeadline',
    locale === 'en'
      ? 'Timeless interiors for coastal living'
      : 'Интерьеры вне времени для жизни у воды',
  );
  const studioImage = homepage?.studioImage || '/images/journal-2.jpg';
  const studioEyebrow = localizedHomepageField(
    homepage,
    locale,
    'studioEyebrow',
    locale === 'en' ? 'The Studio' : 'Студия',
  );
  const studioHeadline = localizedHomepageField(
    homepage,
    locale,
    'studioHeadline',
    locale === 'en'
      ? 'Luxury found in restraint, not abundance.'
      : 'Роскошь, найденная в сдержанности, а не в изобилии.',
  );
  const studioBody = localizedHomepageField(
    homepage,
    locale,
    'studioBody',
    locale === 'en'
      ? 'We create environments that whisper rather than shout — spaces defined by natural light, tactile materials, and uncompromising attention to detail. Each home is a deeply personal collaboration, resulting in rooms that feel both curated and effortless.'
      : 'Мы создаём пространства, которые говорят шёпотом, а не кричат — интерьеры, определённые естественным светом, тактильными материалами и бескомпромиссным вниманием к деталям. Каждый дом — это глубоко личное сотрудничество, результатом которого становятся комнаты, ощущающиеся одновременно продуманными и лёгкими.',
  );

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={heroImage} 
            alt="Maiia Vilhelmsons — New York and Hamptons interior architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 mt-20 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs tracking-[0.3em] uppercase font-light mb-8 text-white/70"
          >
            {heroEyebrow}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide mb-8 leading-tight"
          >
            {heroHeadline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              href={`/${locale}/contact`}
              className="inline-block border border-white/40 px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-foreground transition-all duration-500 mt-4"
            >
              {t('home.cta')}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-10 bg-white/30"
          />
        </motion.div>
      </section>

      {/* Press Logos */}
      <PressLogos locale={locale} />

      {/* About Designer */}
      <AboutDesigner />

      {/* Studio Philosophy Block */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <FadeIn>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-8">
                {studioEyebrow}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif mb-10 leading-tight">
                {studioHeadline}
              </h2>
              <p className="text-lg font-light text-foreground/70 leading-relaxed mb-8">
                {studioBody}
              </p>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent hover:text-foreground transition-colors"
              >
                {locale === 'en' ? 'About the Studio' : 'О студии'} <ArrowRight size={14} />
              </Link>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={studioImage}
                  alt="Maiia Vilhelmsons studio — New York interior architecture"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      {summary && (
        <section className="py-24 bg-background border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="pt-8 md:pt-0">
                  <p className="text-5xl font-serif text-accent mb-4">{summary.totalProjects}+</p>
                  <p className="text-sm tracking-widest uppercase text-foreground/50">{t('home.stats.projects')}</p>
                </div>
                <div className="pt-8 md:pt-0">
                  <p className="text-5xl font-serif text-accent mb-4">{summary.yearsOfExperience}</p>
                  <p className="text-sm tracking-widest uppercase text-foreground/50">{t('home.stats.years')}</p>
                </div>
                <div className="pt-8 md:pt-0">
                  <p className="text-3xl font-serif text-accent mb-4 leading-tight">
                    {summary.locations.slice(0, 2).join(', ')}<br/>
                    <span className="text-xl">& {summary.locations[2]}</span>
                  </p>
                  <p className="text-sm tracking-widest uppercase text-foreground/50">{t('home.stats.locations')}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl md:text-5xl font-serif">{t('home.featured')}</h2>
              <Link href={`/${locale}/portfolio`} className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors">
                {t('general.all_projects')} <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {featuredProjects?.slice(0, 4).map((project, idx) => (
              <FadeIn key={project.id} delay={idx * 0.08}>
                <Link href={`/${locale}/portfolio/${project.slug}`} className="group block">
                  <div className="overflow-hidden bg-muted aspect-[4/5] mb-6 relative">
                    <img 
                      src={project.images?.[0] || `/images/project-${(idx % 3) + 1}.jpg`} 
                      alt={l(project, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      loading={idx < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif mb-2">{l(project, 'title')}</h3>
                      <p className="text-foreground/60 font-light">{project.location}</p>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-accent border border-accent/20 px-3 py-1 mt-1">
                      {t(`type.${project.projectType}` as any) || project.projectType}
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          
          <div className="mt-16 text-center md:hidden">
            <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
              {t('general.all_projects')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-20">{t('home.services')}</h2>
          </FadeIn>
          
          <div className="space-y-0">
            {services?.slice(0, 4).map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 0.06}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-10 border-b border-border last:border-0">
                  <div className="md:w-2/5">
                    <h3 className="text-2xl font-serif">{l(service, 'title')}</h3>
                  </div>
                  <div className="md:w-3/5 flex items-center justify-between gap-8">
                    <p className="text-base font-light text-foreground/70 leading-relaxed hidden md:block">
                      {l(service, 'shortDesc')}
                    </p>
                    <Link href={`/${locale}/services/${service.slug}`} className="text-accent hover:text-foreground transition-colors flex-shrink-0">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-12 text-center">
              <Link href={`/${locale}/services`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors">
                {locale === 'en' ? 'All Services' : 'Все услуги'} <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Journal Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl md:text-5xl font-serif">{t('home.journal')}</h2>
              <Link href={`/${locale}/journal`} className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors">
                {locale === 'en' ? 'All Posts' : 'Все записи'} <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalPosts?.slice(0, 3).map((post, idx) => (
              <FadeIn key={post.id} delay={idx * 0.08}>
                <Link href={`/${locale}/journal/${post.slug}`} className="group block">
                  <div className="overflow-hidden bg-muted aspect-[3/2] mb-6">
                    <img 
                      src={post.coverImage || `/images/journal-${(idx % 2) + 1}.jpg`} 
                      alt={l(post, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs tracking-widest text-foreground/40 uppercase mb-3">
                    {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', { month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-serif mb-3 group-hover:text-accent transition-colors">{l(post, 'title')}</h3>
                  <p className="text-foreground/60 font-light line-clamp-2 text-sm leading-relaxed">{l(post, 'excerpt')}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-foreground text-white text-center px-6">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-serif mb-6 max-w-3xl mx-auto leading-tight">
            {locale === 'en' ? 'Ready to transform your space?' : 'Готовы преобразить ваше пространство?'}
          </h2>
          <p className="text-white/50 font-light mb-12 text-lg">
            {locale === 'en' ? 'We take a limited number of commissions each year.' : 'Мы берёмся за ограниченное число проектов в год.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href={`/${locale}/contact`}
              className="inline-block border border-white/30 px-10 py-5 text-sm uppercase tracking-widest hover:bg-white hover:text-foreground transition-all duration-500"
            >
              {t('home.cta')}
            </Link>
            <a
              href="tel:+1-631-555-0100"
              className="text-white/60 hover:text-white transition-colors font-light text-lg"
            >
              +1 631 555 0100
            </a>
          </div>
        </FadeIn>
      </section>
    </PageTransition>
  );
}
