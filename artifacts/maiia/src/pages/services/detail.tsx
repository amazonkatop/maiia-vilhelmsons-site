import { Link, useParams } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useGetService } from '@workspace/api-client-react';
import { ArrowLeft } from 'lucide-react';

export default function ServiceDetail() {
  const { locale, t, l } = useLocale();
  const params = useParams();
  const slug = params.slug || '';
  
  const { data: service, isLoading } = useGetService(slug, {
    query: { enabled: !!slug }
  });

  if (isLoading) {
    return (
      <div className="pt-40 min-h-screen bg-background flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-40 min-h-screen bg-background text-center">
        <h1 className="text-4xl font-serif mb-6">Service not found</h1>
        <Link href={`/${locale}/services`} className="text-accent underline">Back to services</Link>
      </div>
    );
  }

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <Link href={`/${locale}/services`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors mb-16">
            <ArrowLeft size={16} /> {t('nav.services')}
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-serif mb-12 leading-tight">{l(service, 'title')}</h1>
          
          <div className="prose prose-lg prose-headings:font-serif prose-p:font-light prose-p:text-foreground/80 prose-p:leading-relaxed max-w-none">
            {/* The full description could contain newlines we want to preserve or basic markdown if needed. 
                For a simple implementation, we'll just split by double newline. */}
            {l(service, 'fullDesc').split('\n\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-24 pt-16 border-t border-border">
            <h3 className="text-2xl font-serif mb-6">
              {locale === 'en' ? 'Interested in this service?' : 'Заинтересованы в этой услуге?'}
            </h3>
            <Link href={`/${locale}/contact`} className="inline-block border border-foreground/20 px-8 py-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-500">
              {t('home.cta')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}