import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'wouter';
import {
  createProject,
  getListProjectsQueryKey,
  getGetProjectQueryKey,
  getProject,
  listProjects,
  updateProject,
  type ProjectInput,
} from '@workspace/api-client-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/lib/admin-auth';

const empty: ProjectInput = {
  slug: '',
  titleEn: '',
  titleRu: '',
  descriptionEn: '',
  descriptionRu: '',
  location: '',
  projectType: 'residential',
  images: [],
  featured: false,
  displayOrder: 0,
};

export default function AdminProjectForm() {
  const params = useParams<{ slug?: string }>();
  const isNew = !params.slug || params.slug === 'new';
  const editSlug = isNew ? null : params.slug!;
  const [, setLocation] = useLocation();
  const qc = useQueryClient();

  const existing = useQuery({
    queryKey: editSlug ? getGetProjectQueryKey(editSlug) : ['project', 'new'],
    queryFn: () => getProject(editSlug!),
    enabled: Boolean(editSlug),
  });

  const [form, setForm] = useState<ProjectInput>(empty);
  const [imagesText, setImagesText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    const p = existing.data;
    setForm({
      slug: p.slug,
      titleEn: p.titleEn,
      titleRu: p.titleRu,
      descriptionEn: p.descriptionEn,
      descriptionRu: p.descriptionRu,
      location: p.location,
      projectType: p.projectType,
      images: p.images,
      featured: p.featured,
      displayOrder: p.displayOrder,
    });
    setImagesText(p.images.join('\n'));
    setSlugTouched(true);
  }, [existing.data]);

  const save = useMutation({
    mutationFn: async () => {
      const images = imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      // RU is filled server-side via auto-translate from EN
      const payload: ProjectInput = {
        ...form,
        images,
        titleRu: form.titleEn,
        descriptionRu: form.descriptionEn,
      };
      if (isNew) return createProject(payload);
      const { slug: _slug, ...update } = payload;
      return updateProject(editSlug!, update);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      await listProjects();
      setLocation('/admin/projects');
    },
    onError: (err: Error) => setError(err.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  function setField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
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
          href="/admin/projects"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="font-serif text-3xl mt-3">
          {isNew ? 'New project' : `Edit · ${editSlug}`}
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
            <Field label="Description">
              <Textarea
                rows={5}
                value={form.descriptionEn}
                onChange={(e) => setField('descriptionEn', e.target.value)}
                required
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Details
            </h2>
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
            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                required
              />
            </Field>
            <Field label="Type">
              <select
                className="flex h-9 w-full border border-input bg-transparent px-3 text-sm"
                value={form.projectType}
                onChange={(e) => setField('projectType', e.target.value)}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="hospitality">Hospitality</option>
              </select>
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => setField('featured', e.target.checked)}
              />
              Featured on home page
            </label>
            <Field label="Image URLs (one per line)">
              <Textarea
                rows={4}
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder="/images/example.jpg"
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
              <Link href="/admin/projects">Cancel</Link>
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
