import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  deleteService,
  getListServicesQueryKey,
  listServices,
} from '@workspace/api-client-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminServices() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: getListServicesQueryKey(),
    queryFn: () => listServices(),
  });

  const remove = useMutation({
    mutationFn: (slug: string) => deleteService(slug),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListServicesQueryKey() }),
  });

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Studio services (EN default, RU translation).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">New service</Link>
        </Button>
      </div>

      {isLoading ? <p className="text-sm">Loading…</p> : null}
      {error ? (
        <p className="text-sm text-destructive">
          {(error as Error).message || 'Failed to load'}
        </p>
      ) : null}

      <div className="border border-border divide-y divide-border">
        {(data ?? []).map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
          >
            <div>
              <p className="font-medium">{s.titleEn}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {s.slug} · order {s.displayOrder}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/services/${s.slug}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={remove.isPending}
                onClick={() => {
                  if (
                    confirm(`Delete service “${s.titleEn}”? This cannot be undone.`)
                  ) {
                    remove.mutate(s.slug);
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
            No services yet. Create the first one.
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}
