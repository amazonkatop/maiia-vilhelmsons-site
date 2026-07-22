import { Link, useParams } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useGetProject } from '@workspace/api-client-react';
import { ArrowLeft } from 'lucide-react';

export default function ProjectDetail() {
  const { locale, t, l } = useLocale();
  const params = useParams();
  const slug = params.slug || '';
  
  const { data: project, isLoading } = useGetProject(slug, {
    query: { enabled: !!slug }
  });

  if (isLoading) {
    return (
      <div className="pt-40 min-h-screen bg-background flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 min-h-screen bg-background text-center">
        <h1 className="text-4xl font-serif mb-6">Project not found</h1>
        <Link href={`/${locale}/portfolio`} className="text-accent underline">Back to portfolio</Link>
      </div>
    );
  }

  // Fallback images if API doesn't have enough
  const images = project.images?.length ? project.images : [
    `/images/project-1.jpg`,
    `/images/project-2.jpg`,
    `/images/project-3.jpg`
  ];

  return (
    <PageTransition className="pt-32 pb-32 bg-white min-h-screen">
      <div className="container mx-auto px-6 mb-16">
        <FadeIn>
          <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors mb-12">
            <ArrowLeft size={16} /> {t('general.back')}
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
            <div className="lg:col-span-5">
              <h1 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">{l(project, 'title')}</h1>
              <div className="flex flex-col gap-4 text-sm tracking-widest uppercase text-foreground/60 mb-8 pb-8 border-b border-border">
                <div className="flex justify-between">
                  <span>{t('general.location')}</span>
                  <span className="text-foreground">{project.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('general.type')}</span>
                  <span className="text-foreground">{t(`type.${project.projectType}` as any) || project.projectType}</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg md:text-xl font-light leading-relaxed text-foreground/80">
                {l(project, 'description')}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8 md:gap-16">
          {images.map((img, idx) => (
            <FadeIn key={idx}>
              <div className={`w-full ${idx % 2 !== 0 ? 'md:w-4/5 ml-auto' : 'md:w-5/6'}`}>
                <img 
                  src={img} 
                  alt={`${l(project, 'title')} - ${idx + 1}`} 
                  className="w-full h-auto object-cover bg-muted"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-32 text-center border-t border-border pt-20">
        <Link href={`/${locale}/contact`} className="inline-block border border-foreground/20 px-10 py-5 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-500">
          {t('home.cta')}
        </Link>
      </div>
    </PageTransition>
  );
}