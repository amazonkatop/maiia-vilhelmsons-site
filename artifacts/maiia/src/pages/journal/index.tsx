import { Link } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useListJournalPosts } from '@workspace/api-client-react';

export default function Journal() {
  const { locale, t, l } = useLocale();
  const { data: posts, isLoading } = useListJournalPosts();

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-serif mb-16">{t('nav.journal')}</h1>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="bg-muted aspect-[3/2] mb-6"></div>
                <div className="h-4 bg-muted w-1/4 mb-4"></div>
                <div className="h-8 bg-muted w-3/4 mb-4"></div>
                <div className="h-16 bg-muted w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts?.map((post, idx) => (
              <FadeIn key={post.id} delay={idx * 0.1}>
                <Link href={`/${locale}/journal/${post.slug}`} className="group block">
                  <div className="overflow-hidden bg-muted aspect-[3/2] mb-6 relative">
                    <img 
                      src={post.coverImage || `/images/journal-${(idx % 2) + 1}.jpg`} 
                      alt={l(post, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs tracking-widest text-foreground/50 uppercase mb-3">
                    {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', { month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-accent transition-colors">{l(post, 'title')}</h3>
                  <p className="text-foreground/70 font-light line-clamp-3 leading-relaxed">{l(post, 'excerpt')}</p>
                </Link>
              </FadeIn>
            ))}
            
            {posts?.length === 0 && (
              <div className="col-span-full text-center py-20 text-foreground/50 font-light">
                {locale === 'en' ? 'No posts found.' : 'Записи не найдены.'}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}