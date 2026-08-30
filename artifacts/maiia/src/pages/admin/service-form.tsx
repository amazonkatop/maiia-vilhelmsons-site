import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'wouter';
import {
  createService,
  getGetServiceQueryKey,
  getListServicesQueryKey,
  getService,
  updateService,
  type ServiceInput,
} from '@workspace/api-client-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/lib/admin-auth';

const empty: ServiceInput = {
  slug: '',
  titleEn: '',
  titleRu: '',
  shortDescEn: '',
  shortDescRu: '',
  fullDescEn: '',
  fullDescRu: '',
  displayOrder: 0,
};

export default function AdminServiceForm() {
  const params = useParams<{ slug?: string }>();
  const isNew = !params.slug || params.slug === 'new';
  const editSlug = isNew ? null : params.slug!;
  const [, setLocation] = useLocation();
  const qc = useQueryClient();

  const existing = useQuery({
    queryKey: editSlug ? getGetServiceQueryKey(editSlug) : ['service', 'new'],
    queryFn: () => getService(editSlug!),
    enabled: Boolean(editSlug),
  });

  const [form, setForm] = useState<ServiceInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    const s = existing.data;
    setForm({
      slug: s.slug,
      titleEn: s.titleEn,
      titleRu: s.titleRu,
      shortDescEn: s.shortDescEn,
      shortDescRu: s.shortDescRu,
      fullDescEn: s.fullDescEn,
      fullDescRu: s.fullDescRu,
      displayOrder: s.displayOrder,
    });
    setSlugTouched(true);
  }, [existing.data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: ServiceInput = {
        ...form,
        titleRu: form.titleEn,
        shortDescRu: form.shortDescEn,
        fullDescRu: form.fullDescEn,
      };
      if (isNew) return createService(payload);
      const { slug: _slug, ...update } = payload;
      return updateService(editSlug!, update);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getListServicesQueryKey() });
      setLocation('/admin/services');
    },
    onError: (err: Error) => setError(err.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  function setField<K extends keyof ServiceInput>(key: K, value: ServiceInput[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'titleEn' && !slugTouched && isNew && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <Link
          href="/admin/services"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Services
        </Link>
        <h1 className="font-serif text-3xl mt-3">
          {isNew ? 'New service' : `Edit · ${editSlug}`}
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
            <Field label="Short description">
              <Textarea
                rows={3}
                value={form.shortDescEn}
                onChange={(e) => setField('shortDescEn', e.target.value)}
                required
              />
            </Field>
            <Field label="Full description">
              <Textarea
                rows={6}
                value={form.fullDescEn}
                onChange={(e) => setField('fullDescEn', e.target.value)}
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
            <Field label="Display order">
              <Input
                type="number"
                value={form.displayOrder ?? 0}
                onChange={(e) =>
                  setField('displayOrder', Number(e.target.value) || 0)
                }
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
              <Link href="/admin/services">Cancel</Link>
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
