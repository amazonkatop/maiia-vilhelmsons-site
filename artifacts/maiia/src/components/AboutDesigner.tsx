import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from '../contexts/LocaleContext';
import {
  getHomepageContent,
  localizedHomepageField,
} from '../lib/homepage-content';

export function AboutDesigner() {
  const { locale } = useLocale();
  const { data } = useQuery({
    queryKey: ['homepage'],
    queryFn: getHomepageContent,
  });

  const portrait =
    data?.designerPortrait || '/images/maiia-vilhelmsons-portrait-v2.jpg';
  const name = data?.designerName || 'Maiia Vilhelmsons';
  const eyebrow = localizedHomepageField(
    data,
    locale,
    'designerEyebrow',
    locale === 'en' ? 'Principal Designer' : 'Главный дизайнер',
  );
  const bio1 = localizedHomepageField(data, locale, 'designerBio1');
  const bio2 = localizedHomepageField(data, locale, 'designerBio2');
  const bio3 = localizedHomepageField(data, locale, 'designerBio3');

  return (
    <>
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted">
                <img
                  src={portrait}
                  alt={`${name} — Principal Designer, New York interior architect`}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-accent font-light mb-5">
                {eyebrow}
              </p>

              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                {name}
              </h2>

              <div className="space-y-5 text-lg font-light text-foreground/70 leading-relaxed">
                {bio1 ? <p>{bio1}</p> : null}
                {bio2 ? <p>{bio2}</p> : null}
                {bio3 ? <p>{bio3}</p> : null}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="border-t border-border" />
      </div>
    </>
  );
}
