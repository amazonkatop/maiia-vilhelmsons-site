import { motion } from 'framer-motion';
import { useLocale } from '../contexts/LocaleContext';

// TODO: Replace placeholder text with final approved copy
// TODO: Replace maiia-vilhelmsons-portrait.jpg with professional photography

export function AboutDesigner() {
  const { locale, t } = useLocale();

  return (
    <>
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Portrait — top on mobile, left on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted">
                <img
                  src="/images/maiia-vilhelmsons-portrait.jpg"
                  alt="Maiia Vilhelmsons — Principal Designer"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>
            </motion.div>

            {/* Text — below on mobile, right on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center"
            >
              {/* Eyebrow */}
              <p className="text-xs tracking-[0.3em] uppercase text-accent font-light mb-5">
                {t('aboutDesigner.eyebrow')}
              </p>

              {/* Name */}
              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                Maiia Vilhelmsons
              </h2>

              {/* Bio */}
              <div className="space-y-5 text-lg font-light text-foreground/70 leading-relaxed">
                <p>{t('aboutDesigner.bio1')}</p>
                <p>{t('aboutDesigner.bio2')}</p>
                <p>{t('aboutDesigner.bio3')}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Thin divider */}
      <div className="container mx-auto px-6">
        <div className="border-t border-border" />
      </div>
    </>
  );
}
