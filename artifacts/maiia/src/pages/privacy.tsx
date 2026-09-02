import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';
import { useSiteContact } from '../hooks/useSiteContact';
import { localizedContactField } from '../lib/contact-settings';
import { renderLegalBody } from '../components/LegalBody';

export default function Privacy() {
  const { locale } = useLocale();
  const contact = useSiteContact();

  const content = localizedContactField(
    contact.data,
    locale,
    'privacyContent',
    '',
  );

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <FadeIn>
          <h1 className="text-5xl md:text-6xl font-serif mb-12">
            {locale === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности'}
          </h1>
          {contact.isLoading ? (
            <p className="text-foreground/50 font-light">Loading…</p>
          ) : (
            <div className="space-y-6">{renderLegalBody(content)}</div>
          )}
        </FadeIn>
      </div>
    </PageTransition>
  );
}
