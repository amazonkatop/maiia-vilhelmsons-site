import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { adminLogout, adminMe, type AdminUser } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';

const NAV: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/homepage', label: 'Homepage' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/journal', label: 'Journal' },
  { href: '/admin/contact', label: 'Contact' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    adminMe()
      .then((me) => {
        if (cancelled) return;
        if (!me) {
          setLocation('/admin/login');
          return;
        }
        setUser(me);
      })
      .catch(() => {
        if (!cancelled) setLocation('/admin/login');
      });
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  async function onLogout() {
    await adminLogout();
    setLocation('/admin/login');
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans text-sm tracking-wide uppercase">
        Checking session…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-serif text-2xl tracking-wide">Maiia Admin</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
              {user.email} · {user.role}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/en" target="_blank" rel="noreferrer">
                View site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </div>
        <nav className="mx-auto max-w-5xl px-6 pb-4 flex flex-wrap gap-4">
          {NAV.map((item) => {
            const active = item.exact
              ? location === item.href
              : location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-widest ${
                  active
                    ? 'text-foreground border-b border-foreground pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
