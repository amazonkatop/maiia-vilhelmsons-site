import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getHomepageContent,
  updateHomepageContent,
  type HomepageUpdateInput,
} from '@/lib/homepage-content';

const empty: HomepageUpdateInput = {
  heroImage: '/images/hero.jpg',
  heroEyebrowEn: '',
  heroHeadlineEn: '',
  designerPortrait: '/images/maiia-vilhelmsons-portrait-v2.jpg',
  designerEyebrowEn: 'Principal Designer',
  designerName: 'Maiia Vilhelmsons',
  designerBio1En: '',
  designerBio2En: '',
  designerBio3En: '',
  studioImage: '/images/journal-2.jpg',
  studioEyebrowEn: 'The Studio',
  studioHeadlineEn: '',
  studioBodyEn: '',
};

export default function AdminHomepage() {
  const qc = useQueryClient();
  const existing = useQuery({
    queryKey: ['homepage'],
    queryFn: getHomepageContent,
  });

  const [form, setForm] = useState<HomepageUpdateInput>(empty);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing.data) return;
    const h = existing.data;
    setForm({
      heroImage: h.heroImage,
      heroEyebrowEn: h.heroEyebrowEn,
      heroHeadlineEn: h.heroHeadlineEn,
      designerPortrait: h.designerPortrait,
      designerEyebrowEn: h.designerEyebrowEn,
      designerName: h.designerName,
      designerBio1En: h.designerBio1En,
      designerBio2En: h.designerBio2En,
      designerBio3En: h.designerBio3En,
      studioImage: h.studioImage,
      studioEyebrowEn: h.studioEyebrowEn,
      studioHeadlineEn: h.studioHeadlineEn,
      studioBodyEn: h.studioBodyEn,
    });
  }, [existing.data]);

  const save = useMutation({
    mutationFn: () => updateHomepageContent(form),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['homepage'] });
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  function setField<K extends keyof HomepageUpdateInput>(
    key: K,
    value: HomepageUpdateInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Overview
        </Link>
        <h1 className="font-serif text-3xl mt-3">Homepage</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Edit English copy only. Russian is translated automatically on save
          and shown when visitors switch language on the public site.
        </p>
      </div>

      {existing.isLoading ? (
        <p className="text-sm">Loading…</p>
      ) : existing.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {(existing.error as Error).message}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-10 max-w-2xl">
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Hero
            </h2>
            <Field label="Hero image URL">
              <Input
                value={form.heroImage}
                onChange={(e) => setField('heroImage', e.target.value)}
                required
                placeholder="/images/hero.jpg"
              />
            </Field>
            <Field label="Eyebrow">
              <Input
                value={form.heroEyebrowEn}
                onChange={(e) => setField('heroEyebrowEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Headline">
              <Textarea
                rows={2}
                value={form.heroHeadlineEn}
                onChange={(e) => setField('heroHeadlineEn', e.target.value)}
                required
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Principal Designer
            </h2>
            <Field label="Portrait image URL">
              <Input
                value={form.designerPortrait}
                onChange={(e) => setField('designerPortrait', e.target.value)}
                required
              />
            </Field>
            <Field label="Eyebrow">
              <Input
                value={form.designerEyebrowEn}
                onChange={(e) => setField('designerEyebrowEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Name">
              <Input
                value={form.designerName}
                onChange={(e) => setField('designerName', e.target.value)}
                required
              />
            </Field>
            <Field label="Bio paragraph 1">
              <Textarea
                rows={4}
                value={form.designerBio1En}
                onChange={(e) => setField('designerBio1En', e.target.value)}
                required
              />
            </Field>
            <Field label="Bio paragraph 2">
              <Textarea
                rows={4}
                value={form.designerBio2En}
                onChange={(e) => setField('designerBio2En', e.target.value)}
                required
              />
            </Field>
            <Field label="Bio paragraph 3">
              <Textarea
                rows={4}
                value={form.designerBio3En}
                onChange={(e) => setField('designerBio3En', e.target.value)}
                required
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              The Studio
            </h2>
            <Field label="Studio image URL">
              <Input
                value={form.studioImage}
                onChange={(e) => setField('studioImage', e.target.value)}
                required
              />
            </Field>
            <Field label="Eyebrow">
              <Input
                value={form.studioEyebrowEn}
                onChange={(e) => setField('studioEyebrowEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Headline">
              <Textarea
                rows={2}
                value={form.studioHeadlineEn}
                onChange={(e) => setField('studioHeadlineEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Body">
              <Textarea
                rows={5}
                value={form.studioBodyEn}
                onChange={(e) => setField('studioBodyEn', e.target.value)}
                required
              />
            </Field>
          </section>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {save.isSuccess ? (
            <p className="text-sm text-muted-foreground">
              Saved. Russian copy was refreshed from English.
            </p>
          ) : null}

          <div className="flex gap-3">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? 'Translating & saving…' : 'Save homepage'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
