import { Link, useParams } from 'wouter';
import { useLocale } from '../../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../../components/Animations';
import { useGetJournalPost } from '@workspace/api-client-react';
import { ArrowLeft } from 'lucide-react';

export default function JournalDetail() {
  const { locale, t, l } = useLocale();
  const params = useParams();
  const slug = params.slug || '';
  
  const { data: post, isLoading } = useGetJournalPost(slug, {
    query: { enabled: !!slug }
  });

  if (isLoading) {
    return (
      <div className="pt-40 min-h-screen bg-background flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 min-h-screen bg-background text-center">
        <h1 className="text-4xl font-serif mb-6">Post not found</h1>
        <Link href={`/${locale}/journal`} className="text-accent underline">Back to journal</Link>
      </div>
    );
  }

  return (
    <PageTransition className="pt-32 pb-32 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <FadeIn>
          <Link href={`/${locale}/journal`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors mb-12">
            <ArrowLeft size={16} /> {t('nav.journal')}
          </Link>
          
          <div className="mb-12 text-center">
            <p className="text-xs tracking-widest text-accent uppercase mb-6">
              {new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif leading-tight">{l(post, 'title')}</h1>
          </div>
        </FadeIn>
      </div>
      
      <FadeIn delay={0.2} className="w-full max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full bg-muted overflow-hidden">
          <img 
            src={post.coverImage || `/images/journal-1.jpg`} 
            alt={l(post, 'title')} 
            className="w-full h-full object-cover"
          />
        </div>
      </FadeIn>

      <div className="container mx-auto px-6 max-w-3xl">
        <FadeIn delay={0.3}>
          <div className="prose prose-lg prose-headings:font-serif prose-headings:font-normal prose-p:font-light prose-p:text-foreground/80 prose-p:leading-relaxed max-w-none">
            {l(post, 'body').split('\n\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}