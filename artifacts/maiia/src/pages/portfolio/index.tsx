import { Link } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useListProjects } from '@workspace/api-client-react';
import { useState } from 'react';

export default function Portfolio() {
  const { locale, t, l } = useLocale();
  const [filter, setFilter] = useState<string>('all');
  
  const { data: projects, isLoading } = useListProjects();

  const types = ['all', 'residential', 'commercial', 'hospitality'];

  const filteredProjects = projects?.filter(p => filter === 'all' || p.projectType === filter);

  return (
    <PageTransition className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-serif mb-12">{t('nav.portfolio')}</h1>
          
          <div className="flex flex-wrap gap-8 mb-16 border-b border-border pb-6">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`text-sm tracking-widest uppercase pb-2 relative ${filter === type ? 'text-accent' : 'text-foreground/50 hover:text-foreground'} transition-colors`}
              >
                {type === 'all' ? t('general.all_projects') : t(`type.${type}` as any)}
                {filter === type && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
                )}
              </button>
            ))}
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="bg-muted aspect-[4/5] mb-6"></div>
                <div className="h-8 bg-muted w-2/3 mb-2"></div>
                <div className="h-4 bg-muted w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24">
            {filteredProjects?.map((project, idx) => (
              <FadeIn key={project.id} delay={idx * 0.05}>
                <Link href={`/${locale}/portfolio/${project.slug}`} className="group block">
                  <div className="overflow-hidden bg-muted aspect-[4/5] mb-6 relative">
                    <img 
                      src={project.images?.[0] || `/images/project-${(idx % 3) + 1}.jpg`} 
                      alt={l(project, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif mb-2 group-hover:text-accent transition-colors">{l(project, 'title')}</h3>
                      <p className="text-foreground/60 font-light">{project.location}</p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
            
            {filteredProjects?.length === 0 && (
              <div className="col-span-2 text-center py-20 text-foreground/50 font-light">
                {locale === 'en' ? 'No projects found for this category.' : 'Проекты в данной категории не найдены.'}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}