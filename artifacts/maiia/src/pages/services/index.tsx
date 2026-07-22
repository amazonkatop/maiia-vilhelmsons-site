import { Link } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useListServices } from '@workspace/api-client-react';
import { ArrowRight } from 'lucide-react';

export default function Services() {
  const { locale, t, l } = useLocale();
  const { data: services, isLoading } = useListServices();

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-serif mb-16">{t('nav.services')}</h1>
          <p className="text-xl font-light text-foreground/70 max-w-2xl mb-24 leading-relaxed">
            {locale === 'en' 
              ? 'We offer comprehensive interior architecture and design services, managing every detail from initial concept through final installation.'
              : 'Мы предлагаем комплексные услуги по архитектуре и дизайну интерьера, управляя каждой деталью от первоначальной концепции до финальной реализации.'}
          </p>
        </FadeIn>

        {isLoading ? (
          <div className="space-y-16 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-8 pb-16 border-b border-border">
                <div className="h-8 bg-muted w-1/3"></div>
                <div className="h-24 bg-muted w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {services?.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 0.1}>
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 pb-16 border-b border-border last:border-0 last:pb-0">
                  <div className="md:w-1/3">
                    <h3 className="text-3xl font-serif">{l(service, 'title')}</h3>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-lg font-light text-foreground/80 leading-relaxed mb-8">
                      {l(service, 'shortDesc')}
                    </p>
                    <Link href={`/${locale}/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                      {t('general.read_more')} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}