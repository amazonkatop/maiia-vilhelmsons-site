import { Link } from 'wouter';
import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';
import { 
  useGetSiteSummary, 
  useListFeaturedProjects, 
  useListServices, 
  useListJournalPosts 
} from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { locale, t, l } = useLocale();

  const { data: summary } = useGetSiteSummary();
  const { data: featuredProjects } = useListFeaturedProjects();
  const { data: services } = useListServices();
  const { data: journalPosts } = useListJournalPosts();

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/images/hero.jpg" 
            alt="Interior Design" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6"
          >
            Maiia Vilhelmsons
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl tracking-widest font-light uppercase"
          >
            {t('home.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      {summary && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="pt-8 md:pt-0">
                  <p className="text-5xl font-serif text-accent mb-4">{summary.totalProjects}+</p>
                  <p className="text-sm tracking-widest uppercase text-foreground/60">{t('home.stats.projects')}</p>
                </div>
                <div className="pt-8 md:pt-0">
                  <p className="text-5xl font-serif text-accent mb-4">{summary.yearsOfExperience}</p>
                  <p className="text-sm tracking-widest uppercase text-foreground/60">{t('home.stats.years')}</p>
                </div>
                <div className="pt-8 md:pt-0">
                  <p className="text-3xl font-serif text-accent mb-4 leading-tight">
                    {summary.locations.slice(0, 2).join(', ')}<br/>
                    <span className="text-xl">& {summary.locations[2]}</span>
                  </p>
                  <p className="text-sm tracking-widest uppercase text-foreground/60">{t('home.stats.locations')}</p>
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
              <FadeIn key={project.id} delay={idx * 0.1}>
                <Link href={`/${locale}/portfolio/${project.slug}`} className="group block">
                  <div className="overflow-hidden bg-muted aspect-[4/5] mb-6 relative">
                    {/* Fallback to generated images if API has no images */}
                    <img 
                      src={project.images?.[0] || `/images/project-${(idx % 3) + 1}.jpg`} 
                      alt={l(project, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif mb-2">{l(project, 'title')}</h3>
                      <p className="text-foreground/60 font-light">{project.location}</p>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-accent border border-accent/20 px-3 py-1">
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
          
          <div className="space-y-16">
            {services?.slice(0, 3).map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 0.1}>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pb-16 border-b border-border last:border-0 last:pb-0">
                  <div className="md:w-1/3">
                    <h3 className="text-2xl font-serif">{l(service, 'title')}</h3>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-lg font-light text-foreground/80 leading-relaxed mb-6">
                      {l(service, 'shortDesc')}
                    </p>
                    <Link href={`/${locale}/services/${service.slug}`} className="text-sm uppercase tracking-widest text-accent hover:text-foreground transition-colors flex items-center gap-2">
                      {t('general.read_more')} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif mb-16">{t('home.journal')}</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalPosts?.slice(0, 3).map((post, idx) => (
              <FadeIn key={post.id} delay={idx * 0.1}>
                <Link href={`/${locale}/journal/${post.slug}`} className="group block">
                  <div className="overflow-hidden bg-muted aspect-[3/2] mb-6">
                    <img 
                      src={post.coverImage || `/images/journal-${(idx % 2) + 1}.jpg`} 
                      alt={l(post, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs tracking-widest text-foreground/50 uppercase mb-3">
                    {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', { month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-serif mb-3 group-hover:text-accent transition-colors">{l(post, 'title')}</h3>
                  <p className="text-foreground/70 font-light line-clamp-2">{l(post, 'excerpt')}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-foreground text-white text-center px-6">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-serif mb-10 max-w-3xl mx-auto leading-tight">
            {locale === 'en' ? 'Ready to transform your space?' : 'Готовы преобразить ваше пространство?'}
          </h2>
          <Link 
            href={`/${locale}/contact`}
            className="inline-block border border-white/30 px-10 py-5 text-sm uppercase tracking-widest hover:bg-white hover:text-foreground transition-all duration-500"
          >
            {t('home.cta')}
          </Link>
        </FadeIn>
      </section>
    </PageTransition>
  );
}
