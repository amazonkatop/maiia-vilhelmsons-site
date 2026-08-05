import { Link, useParams } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { Lightbox } from '../../components/Lightbox';
import { useGetProject, useListProjects, getGetProjectQueryKey } from '@workspace/api-client-react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

function SkeletonDetail() {
  return (
    <div className="pt-32 pb-32 bg-white min-h-screen animate-pulse">
      <div className="container mx-auto px-6 mb-16">
        <div className="h-4 bg-muted w-24 mb-16 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
          <div className="lg:col-span-5">
            <div className="h-14 bg-muted w-3/4 mb-6 rounded" />
            <div className="h-4 bg-muted w-full mb-3 rounded" />
            <div className="h-4 bg-muted w-2/3 rounded" />
          </div>
          <div className="lg:col-span-7">
            <div className="h-4 bg-muted w-full mb-3 rounded" />
            <div className="h-4 bg-muted w-5/6 mb-3 rounded" />
            <div className="h-4 bg-muted w-4/5 rounded" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <div className="bg-muted aspect-[16/9] w-full rounded" />
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { locale, t, l } = useLocale();
  const params = useParams();
  const slug = params.slug || '';
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const { data: project, isLoading } = useGetProject(slug, {
    query: { queryKey: getGetProjectQueryKey(slug), enabled: !!slug }
  });

  const { data: allProjects } = useListProjects();

  if (isLoading) return <SkeletonDetail />;

  if (!project) {
    return (
      <div className="pt-40 min-h-screen bg-background text-center">
        <h1 className="text-4xl font-serif mb-6">
          {locale === 'en' ? 'Project not found' : 'Проект не найден'}
        </h1>
        <Link href={`/${locale}/portfolio`} className="text-accent underline">
          {t('general.back')}
        </Link>
      </div>
    );
  }

  const images = project.images?.length ? project.images : [
    `/images/project-1.jpg`,
    `/images/project-2.jpg`,
    `/images/project-3.jpg`
  ];

  // Related projects: same location or same type, excluding self, max 3
  const related = allProjects
    ?.filter(p => p.slug !== slug && (p.location === project.location || p.projectType === project.projectType))
    .slice(0, 3) ?? [];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i === null ? null : (i - 1 + images.length) % images.length);
  const nextImage = () => setLightboxIndex(i => i === null ? null : (i + 1) % images.length);

  return (
    <PageTransition className="pt-32 pb-32 bg-white min-h-screen">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          alt={l(project, 'title')}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <div className="container mx-auto px-6 mb-16">
        <FadeIn>
          <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-12">
            <ArrowLeft size={16} /> {t('general.all_projects')}
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
            <div className="lg:col-span-5">
              <h1 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">{l(project, 'title')}</h1>
              <div className="flex flex-col gap-4 text-sm tracking-widest text-foreground/50 mb-8 pb-8 border-b border-border">
                <div className="flex justify-between uppercase">
                  <span>{t('general.location')}</span>
                  <span className="text-foreground">{project.location}</span>
                </div>
                <div className="flex justify-between uppercase">
                  <span>{t('general.type')}</span>
                  <span className="text-foreground">{t(`type.${project.projectType}` as any) || project.projectType}</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg md:text-xl font-light leading-relaxed text-foreground/75">
                {l(project, 'description')}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-6 md:gap-10">
          {images.map((img, idx) => (
            <FadeIn key={idx}>
              <button
                className={`block w-full text-left cursor-zoom-in group relative overflow-hidden ${idx % 2 !== 0 ? 'md:w-4/5 ml-auto' : 'md:w-5/6'}`}
                onClick={() => openLightbox(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={img} 
                  alt={`${l(project, 'title')} — ${project.location}, ${idx + 1}`}
                  className="w-full h-auto object-cover bg-muted transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-500" />
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Related Projects */}
      {related.length > 0 && (
        <div className="container mx-auto px-6 mt-32">
          <FadeIn>
            <div className="border-t border-border pt-20">
              <h3 className="text-2xl font-serif mb-12">
                {locale === 'en' ? 'Related Projects' : 'Похожие проекты'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((p, idx) => (
                  <FadeIn key={p.id} delay={idx * 0.06}>
                    <Link href={`/${locale}/portfolio/${p.slug}`} className="group block">
                      <div className="overflow-hidden bg-muted aspect-[4/3] mb-4">
                        <img
                          src={p.images?.[0] || `/images/project-${(idx % 3) + 1}.jpg`}
                          alt={l(p, 'title')}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="font-serif text-lg mb-1 group-hover:text-accent transition-colors">{l(p, 'title')}</h4>
                      <p className="text-foreground/50 text-sm">{p.location}</p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      )}
      
      {/* CTA */}
      <div className="container mx-auto px-6 mt-32 text-center border-t border-border pt-20">
        <FadeIn>
          <p className="text-foreground/50 font-light mb-8">
            {locale === 'en' ? 'Interested in starting a project?' : 'Хотите начать проект?'}
          </p>
          <Link href={`/${locale}/contact`} className="inline-block border border-foreground/20 px-10 py-5 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-500">
            {t('home.cta')}
          </Link>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
