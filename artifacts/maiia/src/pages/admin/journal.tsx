import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  deleteJournalPost,
  getListJournalPostsQueryKey,
  listJournalPosts,
} from '@workspace/api-client-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminJournal() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: getListJournalPostsQueryKey(),
    queryFn: () => listJournalPosts(),
  });

  const remove = useMutation({
    mutationFn: (slug: string) => deleteJournalPost(slug),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListJournalPostsQueryKey() }),
  });

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl">Journal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Posts (EN default, RU translation).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/journal/new">New post</Link>
        </Button>
      </div>

      {isLoading ? <p className="text-sm">Loading…</p> : null}
      {error ? (
        <p className="text-sm text-destructive">
          {(error as Error).message || 'Failed to load'}
        </p>
      ) : null}

      <div className="border border-border divide-y divide-border">
        {(data ?? []).map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
          >
            <div>
              <p className="font-medium">{post.titleEn}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {post.slug} · {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/journal/${post.slug}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={remove.isPending}
                onClick={() => {
                  if (
                    confirm(`Delete post “${post.titleEn}”? This cannot be undone.`)
                  ) {
                    remove.mutate(post.slug);
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
            No posts yet. Create the first one.
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}
