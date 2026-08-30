import { Link } from 'wouter';
import { AdminShell } from '@/components/admin/AdminShell';

const CARDS = [
  {
    href: '/admin/homepage',
    title: 'Homepage',
    body: 'Hero photo and headline, principal designer bio, and The Studio block.',
  },
  {
    href: '/admin/projects',
    title: 'Projects',
    body: 'Portfolio pieces shown on the home and portfolio pages.',
  },
  {
    href: '/admin/services',
    title: 'Services',
    body: 'Service offerings. Write in English; Russian is auto-translated.',
  },
  {
    href: '/admin/journal',
    title: 'Journal',
    body: 'Articles and studio notes. Write in English; Russian is auto-translated.',
  },
] as const;

export default function AdminHome() {
  return (
    <AdminShell>
      <h1 className="font-serif text-3xl mb-2">Overview</h1>
      <p className="text-sm text-muted-foreground mb-10 max-w-xl">
        Enter all descriptions in English. Russian copy is generated
        automatically on save and appears when visitors switch language on the
        public site.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-border p-6 hover:border-foreground transition-colors block"
          >
            <h2 className="font-serif text-xl mb-2">{card.title}</h2>
            <p className="text-sm text-muted-foreground">{card.body}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
