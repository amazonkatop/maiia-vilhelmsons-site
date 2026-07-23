import { Link } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useListProjects } from '@workspace/api-client-react';
import { useState } from 'react';

const LOCATIONS = ['Southampton', 'East Hampton', 'Bridgehampton', 'Sag Harbor', 'Westhampton Beach', 'Manhattan'];
const TYPES = ['residential', 'commercial', 'hospitality'];

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted aspect-[4/5] mb-6" />
      <div className="h-7 bg-muted w-2/3 mb-3 rounded" />
      <div className="h-4 bg-muted w-1/3 rounded" />
    </div>
  );
}

export default function Portfolio() {
  const { locale, t, l } = useLocale();
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const { data: projects, isLoading } = useListProjects();

  const filteredProjects = projects?.filter(p => {
    const locMatch = locationFilter === 'all' || p.location === locationFilter;
    const typeMatch = typeFilter === 'all' || p.projectType === typeFilter;
    return locMatch && typeMatch;
  });

  return (
    <PageTransition className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-serif mb-12">{t('nav.portfolio')}</h1>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.05}>
          <div className="mb-16 space-y-4">
            {/* Location filter */}
            <div className="flex flex-wrap gap-6 pb-4 border-b border-border">
              <span className="text-xs uppercase tracking-widest text-foreground/30 self-center w-20 flex-shrink-0">
                {locale === 'en' ? 'Location' : 'Локация'}
              </span>
              {['all', ...LOCATIONS].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`text-sm tracking-wide pb-1 relative transition-colors ${locationFilter === loc ? 'text-accent' : 'text-foreground/50 hover:text-foreground'}`}
                >
                  {loc === 'all' ? (locale === 'en' ? 'All' : 'Все') : loc}
                  {locationFilter === loc && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
                  )}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-6 pb-4">
              <span className="text-xs uppercase tracking-widest text-foreground/30 self-center w-20 flex-shrink-0">
                {locale === 'en' ? 'Type' : 'Тип'}
              </span>
              {['all', ...TYPES].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`text-sm tracking-wide pb-1 relative uppercase transition-colors ${typeFilter === type ? 'text-accent' : 'text-foreground/50 hover:text-foreground'}`}
                >
                  {type === 'all' ? (locale === 'en' ? 'All' : 'Все') : t(`type.${type}` as any)}
                  {typeFilter === type && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24">
              {filteredProjects?.map((project, idx) => (
                <FadeIn key={project.id} delay={idx * 0.05}>
                  <Link href={`/${locale}/portfolio/${project.slug}`} className="group block">
                    <div className="overflow-hidden bg-muted aspect-[4/5] mb-6 relative">
                      <img 
                        src={project.images?.[0] || `/images/project-${(idx % 3) + 1}.jpg`} 
                        alt={l(project, 'title')} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-serif mb-2 group-hover:text-accent transition-colors">{l(project, 'title')}</h3>
                        <p className="text-foreground/50 font-light text-sm">{project.location}</p>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-foreground/40 mt-1">
                        {t(`type.${project.projectType}` as any)}
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>

            {filteredProjects?.length === 0 && (
              <FadeIn>
                <div className="text-center py-32 text-foreground/40 font-light">
                  {locale === 'en' ? 'No projects match this filter.' : 'Нет проектов для данного фильтра.'}
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
