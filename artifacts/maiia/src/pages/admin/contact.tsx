import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getContactSettings,
  updateContactSettings,
  type ContactSettingsUpdateInput,
} from '@/lib/contact-settings';

const empty: ContactSettingsUpdateInput = {
  inquiryEmail: '',
  studioEmail: '',
  phone: '',
  studioAddressEn: '',
  studioSubtitleEn: '',
  footerLocation1: '',
  footerLocation2: '',
  footerTaglineEn: '',
  followInstagramUrl: '',
  followPinterestUrl: '',
  followExtraLabel: '',
  followExtraUrl: '',
  privacyContentEn: '',
  termsContentEn: '',
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-border p-6 space-y-6">
      <div>
        <h2 className="font-serif text-xl">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function AdminContact() {
  const qc = useQueryClient();
  const existing = useQuery({
    queryKey: ['contact-settings'],
    queryFn: getContactSettings,
  });

  const [form, setForm] = useState<ContactSettingsUpdateInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    const c = existing.data;
    setForm({
      inquiryEmail: c.inquiryEmail,
      studioEmail: c.studioEmail,
      phone: c.phone,
      studioAddressEn: c.studioAddressEn,
      studioSubtitleEn: c.studioSubtitleEn,
      footerLocation1: c.footerLocation1,
      footerLocation2: c.footerLocation2,
      footerTaglineEn: c.footerTaglineEn,
      followInstagramUrl: c.followInstagramUrl,
      followPinterestUrl: c.followPinterestUrl,
      followExtraLabel: c.followExtraLabel,
      followExtraUrl: c.followExtraUrl,
      privacyContentEn: c.privacyContentEn,
      termsContentEn: c.termsContentEn,
    });
  }, [existing.data]);

  const save = useMutation({
    mutationFn: () => updateContactSettings(form),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['contact-settings'] });
      await qc.invalidateQueries({ queryKey: ['site-contact'] });
      setError(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    },
    onError: (err: Error) => setError(err.message),
  });

  function setField<K extends keyof ContactSettingsUpdateInput>(
    key: K,
    value: ContactSettingsUpdateInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-3xl mb-2">Contact</h1>
      <p className="text-sm text-muted-foreground mb-10 max-w-2xl">
        Manage studio details shown on the Contact page and site footer, social
        links, and legal documents. Write in English — Russian is auto-translated
        on save.
      </p>

      {existing.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <form onSubmit={onSubmit} className="max-w-3xl space-y-8">
          <Section
            title="Inquiries"
            description="Email that receives contact form submissions (not shown on the public site)."
          >
            <div className="space-y-2">
              <Label htmlFor="inquiryEmail">Inquiry email</Label>
              <Input
                id="inquiryEmail"
                type="email"
                required
                value={form.inquiryEmail}
                onChange={(e) => setField('inquiryEmail', e.target.value)}
              />
            </div>
          </Section>

          <Section
            title="Studio"
            description="Shown in the Contact page Studio block and footer."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="studioAddressEn">Address</Label>
                <Input
                  id="studioAddressEn"
                  required
                  value={form.studioAddressEn}
                  onChange={(e) => setField('studioAddressEn', e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="studioSubtitleEn">Subtitle</Label>
                <Input
                  id="studioSubtitleEn"
                  required
                  value={form.studioSubtitleEn}
                  onChange={(e) => setField('studioSubtitleEn', e.target.value)}
                  placeholder="By appointment — Hamptons & Manhattan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studioEmail">Public email</Label>
                <Input
                  id="studioEmail"
                  type="email"
                  required
                  value={form.studioEmail}
                  onChange={(e) => setField('studioEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerLocation1">Footer location 1</Label>
                <Input
                  id="footerLocation1"
                  required
                  value={form.footerLocation1}
                  onChange={(e) => setField('footerLocation1', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerLocation2">Footer location 2</Label>
                <Input
                  id="footerLocation2"
                  required
                  value={form.footerLocation2}
                  onChange={(e) => setField('footerLocation2', e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="footerTaglineEn">Footer tagline</Label>
                <Textarea
                  id="footerTaglineEn"
                  required
                  rows={3}
                  value={form.footerTaglineEn}
                  onChange={(e) => setField('footerTaglineEn', e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Follow"
            description="Social links on the Contact page and footer."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="followInstagramUrl">Instagram URL</Label>
                <Input
                  id="followInstagramUrl"
                  required
                  value={form.followInstagramUrl}
                  onChange={(e) =>
                    setField('followInstagramUrl', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followPinterestUrl">Pinterest URL</Label>
                <Input
                  id="followPinterestUrl"
                  required
                  value={form.followPinterestUrl}
                  onChange={(e) =>
                    setField('followPinterestUrl', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followExtraLabel">Extra link label</Label>
                <Input
                  id="followExtraLabel"
                  required
                  value={form.followExtraLabel}
                  onChange={(e) => setField('followExtraLabel', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followExtraUrl">Extra link URL</Label>
                <Input
                  id="followExtraUrl"
                  required
                  value={form.followExtraUrl}
                  onChange={(e) => setField('followExtraUrl', e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Privacy Policy"
            description="Markdown-style text. Use ## for section headings and blank lines between paragraphs."
          >
            <Textarea
              id="privacyContentEn"
              required
              rows={16}
              className="font-mono text-sm"
              value={form.privacyContentEn}
              onChange={(e) => setField('privacyContentEn', e.target.value)}
            />
          </Section>

          <Section
            title="Terms of Use"
            description="Markdown-style text. Use ## for section headings and blank lines between paragraphs."
          >
            <Textarea
              id="termsContentEn"
              required
              rows={16}
              className="font-mono text-sm"
              value={form.termsContentEn}
              onChange={(e) => setField('termsContentEn', e.target.value)}
            />
          </Section>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          {saved ? (
            <p className="text-sm text-muted-foreground">Saved.</p>
          ) : null}

          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
