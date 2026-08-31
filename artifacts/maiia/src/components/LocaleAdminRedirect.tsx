import { Redirect, useLocation } from 'wouter';

/** /en/admin/* and /ru/admin/* → /admin/* (admin is locale-neutral). */
export function LocaleAdminRedirect() {
  const [location] = useLocation();
  const target = location.replace(/^\/(en|ru)(\/admin.*)$/, '$2');
  return <Redirect to={target} />;
}
