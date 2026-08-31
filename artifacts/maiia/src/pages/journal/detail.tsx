import { Link, useParams } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useGetJournalPost, getGetJournalPostQueryKey } from '@workspace/api-client-react';
import { ArrowLeft } from 'lucide-react';
import { renderJournalBody } from '../../components/JournalBody';

function SkeletonArticle() {
  return (
    <div className="pt-32 pb-32 bg-white min-h-screen animate-pulse">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="h-4 bg-muted w-20 mb-16 rounded" />
        <div className="text-center mb-12">
          <div className="h-3 bg-muted w-24 mx-auto mb-6 rounded" />
          <div className="h-12 bg-muted w-3/4 mx-auto mb-3 rounded" />
          <div className="h-12 bg-muted w-1/2 mx-auto rounded" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] bg-muted w-full" />
      </div>
      <div className="container mx-auto px-6 max-w-3xl space-y-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />)}
      </div>
    </div>
  );
}

export default function JournalDetail() {
  const { locale, t, l } = useLocale();
  const params = useParams();
  const slug = params.slug || '';
  
  const { data: post, isLoading } = useGetJournalPost(slug, {
    query: { queryKey: getGetJournalPostQueryKey(slug), enabled: !!slug }
  });

  if (isLoading) return <SkeletonArticle />;

  if (!post) {
    return (
      <div className="pt-40 min-h-screen bg-background text-center">
        <h1 className="text-4xl font-serif mb-6">
          {locale === 'en' ? 'Post not found' : 'Статья не найдена'}
        </h1>
        <Link href={`/${locale}/journal`} className="text-accent underline">{t('general.back')}</Link>
      </div>
    );
  }

  const title = l(post, 'title');

  // JSON-LD Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: 'Maiia Vilhelmsons' },
    publisher: {
      '@type': 'Organization',
      name: 'Maiia Vilhelmsons Studio',
      logo: { '@type': 'ImageObject', url: '/favicon.svg' }
    },
  };

  return (
    <PageTransition className="pt-32 pb-32 bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-6 max-w-3xl">
        <FadeIn>
          <Link href={`/${locale}/journal`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors mb-12">
            <ArrowLeft size={16} /> {t('nav.journal')}
          </Link>
          
          <div className="mb-16 text-center">
            <p className="text-xs tracking-widest text-accent uppercase mb-6">
              {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif leading-tight">{title}</h1>
            <p className="mt-6 text-lg font-light text-foreground/60 leading-relaxed max-w-xl mx-auto">
              {l(post, 'excerpt')}
            </p>
          </div>
        </FadeIn>
      </div>
      
      <FadeIn delay={0.1} className="w-full max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full bg-muted overflow-hidden">
          <img 
            src={post.coverImage || `/images/journal-1.jpg`} 
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </FadeIn>

      <div className="container mx-auto px-6 max-w-3xl">
        <FadeIn delay={0.15}>
          <div className="space-y-7">
            {renderJournalBody(l(post, 'body'))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-20 pt-12 border-t border-border flex items-center justify-between">
            <Link href={`/${locale}/journal`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors">
              <ArrowLeft size={14} /> {locale === 'en' ? 'All Posts' : 'Все записи'}
            </Link>
            <Link href={`/${locale}/contact`} className="text-sm uppercase tracking-widest hover:text-accent transition-colors">
              {t('home.cta')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
