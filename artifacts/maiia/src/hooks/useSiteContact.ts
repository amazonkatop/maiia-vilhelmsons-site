import { useQuery } from '@tanstack/react-query';
import { getPublicContactSettings } from '@/lib/contact-settings';

export function useSiteContact() {
  return useQuery({
    queryKey: ['site-contact'],
    queryFn: getPublicContactSettings,
    staleTime: 5 * 60 * 1000,
  });
}
