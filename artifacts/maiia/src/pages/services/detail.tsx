import { Link, useParams } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { ServiceProcess } from '../../components/ServiceProcess';
import { useGetService, getGetServiceQueryKey } from '@workspace/api-client-react';
import { ArrowLeft } from 'lucide-react';

function SkeletonDetail() {
  return (
    <div className="pt-32 pb-32 bg-background min-h-screen animate-pulse">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="h-4 bg-muted w-24 mb-16 rounded" />
        <div className="h-14 bg-muted w-2/3 mb-10 rounded" />
        <div className="space-y-3">
          <div className="h-4 bg-muted w-full rounded" />
          <div className="h-4 bg-muted w-5/6 rounded" />
          <div className="h-4 bg-muted w-4/5 rounded" />
          <div className="h-4 bg-muted w-full rounded" />
          <div className="h-4 bg-muted w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  const { locale, t, l } = useLocale();
  const params = useParams();
  const slug = params.slug || '';
  
  const { data: service, isLoading } = useGetService(slug, {
    query: { queryKey: getGetServiceQueryKey(slug), enabled: !!slug }
  });

  if (isLoading) return <SkeletonDetail />;

  if (!service) {
    return (
      <div className="pt-40 min-h-screen bg-background text-center">
        <h1 className="text-4xl font-serif mb-6">
          {locale === 'en' ? 'Service not found' : 'Услуга не найдена'}
        </h1>
        <Link href={`/${locale}/services`} className="text-accent underline">
          {t('general.back')}
        </Link>
      </div>
    );
  }

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <Link href={`/${locale}/services`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-16">
            <ArrowLeft size={16} /> {t('nav.services')}
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">{l(service, 'title')}</h1>
          <p className="text-lg font-light text-foreground/60 mb-12 leading-relaxed border-b border-border pb-12">
            {l(service, 'shortDesc')}
          </p>
          
          <div className="space-y-6">
            {l(service, 'fullDesc').split('\n\n').map((paragraph: string, i: number) => (
              <p key={i} className="text-lg font-light text-foreground/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>

        {/* Process stepper */}
        <ServiceProcess locale={locale} />

        <FadeIn>
          <div className="mt-20 pt-16 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href={`/${locale}/contact`} className="inline-block border border-foreground/20 px-8 py-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-500">
              {t('home.cta')}
            </Link>
            <a href="tel:+1-631-555-0100" className="text-foreground/50 hover:text-accent transition-colors font-light">
              +1 631 555 0100
            </a>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
