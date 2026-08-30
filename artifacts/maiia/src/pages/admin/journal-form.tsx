import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'wouter';
import {
  createJournalPost,
  getGetJournalPostQueryKey,
  getJournalPost,
  getListJournalPostsQueryKey,
  updateJournalPost,
  type JournalPostInput,
} from '@workspace/api-client-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/lib/admin-auth';

const empty: JournalPostInput = {
  slug: '',
  titleEn: '',
  titleRu: '',
  excerptEn: '',
  excerptRu: '',
  bodyEn: '',
  bodyRu: '',
  coverImage: '',
  publishedAt: new Date().toISOString(),
};

export default function AdminJournalForm() {
  const params = useParams<{ slug?: string }>();
  const isNew = !params.slug || params.slug === 'new';
  const editSlug = isNew ? null : params.slug!;
  const [, setLocation] = useLocation();
  const qc = useQueryClient();

  const existing = useQuery({
    queryKey: editSlug
      ? getGetJournalPostQueryKey(editSlug)
      : ['journal', 'new'],
    queryFn: () => getJournalPost(editSlug!),
    enabled: Boolean(editSlug),
  });

  const [form, setForm] = useState<JournalPostInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    const p = existing.data;
    setForm({
      slug: p.slug,
      titleEn: p.titleEn,
      titleRu: p.titleRu,
      excerptEn: p.excerptEn,
      excerptRu: p.excerptRu,
      bodyEn: p.bodyEn,
      bodyRu: p.bodyRu,
      coverImage: p.coverImage,
      publishedAt: p.publishedAt,
    });
    setSlugTouched(true);
  }, [existing.data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: JournalPostInput = {
        ...form,
        titleRu: form.titleEn,
        excerptRu: form.excerptEn,
        bodyRu: form.bodyEn,
        coverImage: form.coverImage || '',
        publishedAt: form.publishedAt || undefined,
      };
      if (isNew) return createJournalPost(payload);
      const { slug: _slug, ...update } = payload;
      return updateJournalPost(editSlug!, update);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getListJournalPostsQueryKey() });
      setLocation('/admin/journal');
    },
    onError: (err: Error) => setError(err.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  function setField<K extends keyof JournalPostInput>(
    key: K,
    value: JournalPostInput[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'titleEn' && !slugTouched && isNew && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  const publishedLocal = form.publishedAt
    ? new Date(form.publishedAt).toISOString().slice(0, 16)
    : '';

  return (
    <AdminShell>
      <div className="mb-8">
        <Link
          href="/admin/journal"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Journal
        </Link>
        <h1 className="font-serif text-3xl mt-3">
          {isNew ? 'New post' : `Edit · ${editSlug}`}
        </h1>
      </div>

      {existing.isLoading && editSlug ? (
        <p className="text-sm">Loading…</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Content (English)
            </h2>
            <p className="text-sm text-muted-foreground">
              Russian is translated automatically when you save.
            </p>
            <Field label="Title">
              <Input
                value={form.titleEn}
                onChange={(e) => setField('titleEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Excerpt">
              <Textarea
                rows={3}
                value={form.excerptEn}
                onChange={(e) => setField('excerptEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Body">
              <Textarea
                rows={10}
                value={form.bodyEn}
                onChange={(e) => setField('bodyEn', e.target.value)}
                required
              />
            </Field>
          </section>

          <section className="space-y-4">
            <Field label="Slug (URL)">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setField('slug', slugify(e.target.value) || e.target.value);
                }}
                required
                disabled={!isNew}
              />
            </Field>
            <Field label="Cover image URL">
              <Input
                value={form.coverImage ?? ''}
                onChange={(e) => setField('coverImage', e.target.value)}
                placeholder="/images/journal-cover.jpg"
              />
            </Field>
            <Field label="Published at">
              <Input
                type="datetime-local"
                value={publishedLocal}
                onChange={(e) => {
                  const v = e.target.value;
                  setField(
                    'publishedAt',
                    v ? new Date(v).toISOString() : undefined,
                  );
                }}
              />
            </Field>
          </section>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-3">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/journal">Cancel</Link>
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
