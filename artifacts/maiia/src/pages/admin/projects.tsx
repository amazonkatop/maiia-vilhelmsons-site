import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  deleteProject,
  getListProjectsQueryKey,
  listProjects,
} from '@workspace/api-client-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminProjects() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: getListProjectsQueryKey(),
    queryFn: () => listProjects(),
  });

  const remove = useMutation({
    mutationFn: (slug: string) => deleteProject(slug),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListProjectsQueryKey() }),
  });

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio entries (EN default, RU translation).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>

      {isLoading ? <p className="text-sm">Loading…</p> : null}
      {error ? (
        <p className="text-sm text-destructive">
          {(error as Error).message || 'Failed to load'}
        </p>
      ) : null}

      <div className="border border-border divide-y divide-border">
        {(data ?? []).map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
          >
            <div>
              <p className="font-medium">{p.titleEn}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {p.slug} · {p.projectType} · {p.location}
                {p.featured ? ' · featured' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/projects/${p.slug}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={remove.isPending}
                onClick={() => {
                  if (
                    confirm(`Delete project “${p.titleEn}”? This cannot be undone.`)
                  ) {
                    remove.mutate(p.slug);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {data && data.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">
            No projects yet. Create the first one.
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}
