export type Locale = 'en' | 'ru';

export interface PageMeta {
  title: string;
  description: string;
  /** Absolute canonical URL for this exact page. */
  canonical: string;
  /** JSON-LD blocks to embed as <script type="application/ld+json"> tags. */
  jsonLd?: Record<string, unknown>[];
}

// TODO: set this to the real production domain once the site has one.
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://maiiavilhelmsons.com';

function canonicalFor(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}

/** Builds the <link rel="alternate" hreflang="..."> set for a path pair. */
export function hreflangLinks(pathWithoutLocale: string) {
  return [
    { hreflang: 'en', href: canonicalFor(`/en${pathWithoutLocale}`) },
    { hreflang: 'ru', href: canonicalFor(`/ru${pathWithoutLocale}`) },
    { hreflang: 'x-default', href: canonicalFor(`/en${pathWithoutLocale}`) },
  ];
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Maiia Vilhelmsons Interior Design',
  description:
    'Exclusive interior design studio serving the Hamptons and Manhattan.',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'NY',
    addressLocality: 'Southampton',
    addressCountry: 'US',
  },
  // TODO: replace with real office coordinates once confirmed.
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.8848,
    longitude: -72.3899,
  },
  areaServed: [
    'Southampton',
    'East Hampton',
    'Bridgehampton',
    'Sag Harbor',
    'Westhampton Beach',
    'Manhattan',
  ],
  telephone: '+1-929-600-1851',
  url: canonicalFor('/en'),
};

function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonicalFor(item.path),
    })),
  };
}

const copy = {
  home: {
    en: {
      title: 'Hamptons Interior Designer | Maiia Vilhelmsons',
      description:
        'Exclusive interior design studio serving Southampton, East Hampton, Bridgehampton, Sag Harbor and Manhattan. Timeless interiors for coastal living.',
    },
    ru: {
      title: 'Дизайнер интерьеров в Хэмптонс | Maiia Vilhelmsons',
      description:
        'Эксклюзивная студия дизайна интерьера в Саутгемптоне, Ист-Хэмптоне, Бриджгемптоне, Саг-Харборе и на Манхэттене. Интерьеры вне времени для жизни у воды.',
    },
  },
  portfolio: {
    en: {
      title: 'Portfolio | Hamptons & Manhattan Interior Design Projects',
      description:
        'Browse waterfront, new-build, renovation and coastal cottage interior design projects across the Hamptons and Manhattan by Maiia Vilhelmsons.',
    },
    ru: {
      title: 'Портфолио | Проекты дизайна интерьера в Хэмптонс и Манхэттене',
      description:
        'Проекты дизайна интерьера — от прибрежных резиденций до новостроек — в Хэмптонс и на Манхэттене от Maiia Vilhelmsons.',
    },
  },
  about: {
    en: {
      title: 'About the Studio | Maiia Vilhelmsons Interior Design',
      description:
        'Learn about Maiia Vilhelmsons and the philosophy behind our full-service interior design studio serving the Hamptons and Manhattan.',
    },
    ru: {
      title: 'О студии | Maiia Vilhelmsons Interior Design',
      description:
        'История, философия и команда студии дизайна интерьера Maiia Vilhelmsons в Хэмптонс и на Манхэттене.',
    },
  },
  services: {
    en: {
      title: 'Interior Design Services | Maiia Vilhelmsons',
      description:
        'Full-service interior design, new construction & renovation design, custom furnishings, kitchen & bath design and color consulting for Hamptons homes.',
    },
    ru: {
      title: 'Услуги дизайна интерьера | Maiia Vilhelmsons',
      description:
        'Полный цикл дизайна интерьера, проектирование новостроек и ремонтов, подбор мебели, дизайн кухонь и ванных комнат в Хэмптонс.',
    },
  },
  journal: {
    en: {
      title: 'Journal | Interior Design Insights from the Hamptons',
      description:
        'Coastal design trends, press features and before/after case studies from Maiia Vilhelmsons Interior Design.',
    },
    ru: {
      title: 'Журнал | Тренды дизайна интерьера из Хэмптонс',
      description:
        'Тренды прибрежного дизайна, публикации в прессе и кейсы до/после от студии Maiia Vilhelmsons.',
    },
  },
  contact: {
    en: {
      title: 'Book a Consultation | Maiia Vilhelmsons Interior Design',
      description:
        'Request an interior design consultation for your Hamptons or Manhattan property. Call or send us your project details.',
    },
    ru: {
      title: 'Записаться на консультацию | Maiia Vilhelmsons',
      description:
        'Запросите консультацию по дизайну интерьера для вашего объекта в Хэмптонс или на Манхэттене.',
    },
  },
} as const;

/**
 * Resolves <head> metadata for a given SSR path. `data` carries any
 * already-prefetched entity (project/service/journal post) so detail
 * pages get a real, specific title/description instead of a generic one.
 */
export function getPageMeta(
  path: string,
  data?: {
    project?: { titleEn?: string; titleRu?: string; location?: string; descriptionEn?: string; descriptionRu?: string };
    service?: { titleEn?: string; titleRu?: string; shortDescEn?: string; shortDescRu?: string };
    journalPost?: { titleEn?: string; titleRu?: string; excerptEn?: string; excerptRu?: string };
  },
): PageMeta {
  const locale: Locale = path.startsWith('/ru') ? 'ru' : 'en';
  const withoutLocale = path.replace(/^\/(en|ru)/, '') || '/';

  // Home
  if (withoutLocale === '/' || withoutLocale === '') {
    return {
      ...copy.home[locale],
      canonical: canonicalFor(path),
      jsonLd: [localBusinessJsonLd],
    };
  }

  // Portfolio detail: /portfolio/:slug
  const portfolioDetail = withoutLocale.match(/^\/portfolio\/([^/]+)$/);
  if (portfolioDetail && data?.project) {
    const title =
      locale === 'en' ? data.project.titleEn : data.project.titleRu;
    const desc =
      (locale === 'en' ? data.project.descriptionEn : data.project.descriptionRu) ||
      copy.portfolio[locale].description;
    const locationSuffix = data.project.location ? ` | ${data.project.location}` : '';
    return {
      title: `${title || 'Project'}${locationSuffix} | Maiia Vilhelmsons`,
      description: desc.slice(0, 160),
      canonical: canonicalFor(path),
      jsonLd: [
        breadcrumbJsonLd([
          { name: locale === 'en' ? 'Home' : 'Главная', path: `/${locale}` },
          { name: copy.portfolio[locale].title.split(' |')[0], path: `/${locale}/portfolio` },
          { name: title || '', path },
        ]),
      ],
    };
  }
  if (withoutLocale === '/portfolio') {
    return {
      ...copy.portfolio[locale],
      canonical: canonicalFor(path),
      jsonLd: [
        breadcrumbJsonLd([
          { name: locale === 'en' ? 'Home' : 'Главная', path: `/${locale}` },
          { name: copy.portfolio[locale].title.split(' |')[0], path },
        ]),
      ],
    };
  }

  // Services detail
  const serviceDetail = withoutLocale.match(/^\/services\/([^/]+)$/);
  if (serviceDetail && data?.service) {
    const title = locale === 'en' ? data.service.titleEn : data.service.titleRu;
    const desc =
      (locale === 'en' ? data.service.shortDescEn : data.service.shortDescRu) ||
      copy.services[locale].description;
    return {
      title: `${title || 'Service'} | Maiia Vilhelmsons`,
      description: desc.slice(0, 160),
      canonical: canonicalFor(path),
      jsonLd: [
        breadcrumbJsonLd([
          { name: locale === 'en' ? 'Home' : 'Главная', path: `/${locale}` },
          { name: copy.services[locale].title.split(' |')[0], path: `/${locale}/services` },
          { name: title || '', path },
        ]),
      ],
    };
  }
  if (withoutLocale === '/services') {
    return {
      ...copy.services[locale],
      canonical: canonicalFor(path),
      jsonLd: [
        breadcrumbJsonLd([
          { name: locale === 'en' ? 'Home' : 'Главная', path: `/${locale}` },
          { name: copy.services[locale].title.split(' |')[0], path },
        ]),
      ],
    };
  }

  // Journal detail
  const journalDetail = withoutLocale.match(/^\/journal\/([^/]+)$/);
  if (journalDetail && data?.journalPost) {
    const title = locale === 'en' ? data.journalPost.titleEn : data.journalPost.titleRu;
    const desc =
      (locale === 'en' ? data.journalPost.excerptEn : data.journalPost.excerptRu) ||
      copy.journal[locale].description;
    return {
      title: `${title || 'Journal'} | Maiia Vilhelmsons`,
      description: desc.slice(0, 160),
      canonical: canonicalFor(path),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: desc,
          url: canonicalFor(path),
        },
        breadcrumbJsonLd([
          { name: locale === 'en' ? 'Home' : 'Главная', path: `/${locale}` },
          { name: copy.journal[locale].title.split(' |')[0], path: `/${locale}/journal` },
          { name: title || '', path },
        ]),
      ],
    };
  }
  if (withoutLocale === '/journal') {
    return {
      ...copy.journal[locale],
      canonical: canonicalFor(path),
      jsonLd: [
        breadcrumbJsonLd([
          { name: locale === 'en' ? 'Home' : 'Главная', path: `/${locale}` },
          { name: copy.journal[locale].title.split(' |')[0], path },
        ]),
      ],
    };
  }

  if (withoutLocale === '/about') {
    return { ...copy.about[locale], canonical: canonicalFor(path) };
  }
  if (withoutLocale === '/contact') {
    return { ...copy.contact[locale], canonical: canonicalFor(path) };
  }

  // Fallback (404 or unmapped route) — noindex so Google doesn't index junk pages.
  return {
    title: 'Maiia Vilhelmsons',
    description: copy.home[locale].description,
    canonical: canonicalFor(path),
  };
}
