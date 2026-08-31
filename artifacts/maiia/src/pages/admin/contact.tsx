import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminShell } from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getContactSettings,
  updateContactSettings,
} from '@/lib/contact-settings';

export default function AdminContact() {
  const qc = useQueryClient();
  const existing = useQuery({
    queryKey: ['contact-settings'],
    queryFn: getContactSettings,
  });

  const [inquiryEmail, setInquiryEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!existing.data) return;
    setInquiryEmail(existing.data.inquiryEmail);
  }, [existing.data]);

  const save = useMutation({
    mutationFn: () => updateContactSettings({ inquiryEmail }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['contact-settings'] });
      setError(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    },
    onError: (err: Error) => setError(err.message),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    save.mutate();
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-3xl mb-2">Contact</h1>
      <p className="text-sm text-muted-foreground mb-10 max-w-xl">
        Set the email address that receives submissions from the public contact
        form. Leads are always saved in the database; if Resend is configured
        on the API server, a notification email is sent as well.
      </p>

      {existing.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <form onSubmit={onSubmit} className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="inquiryEmail">Inquiry email</Label>
            <Input
              id="inquiryEmail"
              type="email"
              required
              value={inquiryEmail}
              onChange={(e) => setInquiryEmail(e.target.value)}
              placeholder="studio@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Contact form submissions from the site will be forwarded to this
              address.
            </p>
          </div>

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
