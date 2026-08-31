import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { LocaleProvider } from './contexts/LocaleContext';
import { Layout } from './components/Layout';

// Public pages
import Home from './pages/home';
import Portfolio from './pages/portfolio';
import ProjectDetail from './pages/portfolio/detail';
import About from './pages/about';
import Services from './pages/services';
import ServiceDetail from './pages/services/detail';
import Journal from './pages/journal';
import JournalDetail from './pages/journal/detail';
import Contact from './pages/contact';

// Admin (English UI; RU auto-translated on save)
import AdminLogin from './pages/admin/login';
import AdminHome from './pages/admin/home';
import AdminHomepage from './pages/admin/homepage';
import AdminProjects from './pages/admin/projects';
import AdminProjectForm from './pages/admin/project-form';
import AdminServices from './pages/admin/services';
import AdminServiceForm from './pages/admin/service-form';
import AdminJournal from './pages/admin/journal';
import AdminJournalForm from './pages/admin/journal-form';
import { LocaleAdminRedirect } from './components/LocaleAdminRedirect';

const localeAdminPaths = ['/en', '/ru'].flatMap((locale) => [
  `${locale}/admin`,
  `${locale}/admin/:p1`,
  `${locale}/admin/:p1/:p2`,
  `${locale}/admin/:p1/:p2/:p3`,
]);

function Router() {
  return (
    <Switch>
      {/* Admin — outside public Layout; default site language remains EN */}
      {localeAdminPaths.map((path) => (
        <Route key={path} path={path} component={LocaleAdminRedirect} />
      ))}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/homepage" component={AdminHomepage} />
      <Route path="/admin/projects/new" component={AdminProjectForm} />
      <Route path="/admin/projects/:slug/edit" component={AdminProjectForm} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/services/new" component={AdminServiceForm} />
      <Route path="/admin/services/:slug/edit" component={AdminServiceForm} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/journal/new" component={AdminJournalForm} />
      <Route path="/admin/journal/:slug/edit" component={AdminJournalForm} />
      <Route path="/admin/journal" component={AdminJournal} />
      <Route path="/admin" component={AdminHome} />

      {/* Public site */}
      <Route>
        <Layout>
          <Switch>
            {/* English is the default locale */}
            <Route path="/" component={() => <Redirect to="/en" />} />

            <Route path="/en" component={Home} />
            <Route path="/en/portfolio" component={Portfolio} />
            <Route path="/en/portfolio/:slug" component={ProjectDetail} />
            <Route path="/en/about" component={About} />
            <Route path="/en/services" component={Services} />
            <Route path="/en/services/:slug" component={ServiceDetail} />
            <Route path="/en/journal" component={Journal} />
            <Route path="/en/journal/:slug" component={JournalDetail} />
            <Route path="/en/contact" component={Contact} />

            <Route path="/ru" component={Home} />
            <Route path="/ru/portfolio" component={Portfolio} />
            <Route path="/ru/portfolio/:slug" component={ProjectDetail} />
            <Route path="/ru/about" component={About} />
            <Route path="/ru/services" component={Services} />
            <Route path="/ru/services/:slug" component={ServiceDetail} />
            <Route path="/ru/journal" component={Journal} />
            <Route path="/ru/journal/:slug" component={JournalDetail} />
            <Route path="/ru/contact" component={Contact} />

            <Route>
              <div className="min-h-screen flex items-center justify-center bg-background text-center pt-24">
                <div>
                  <h1 className="text-4xl font-serif mb-4 text-foreground">
                    404 Not Found
                  </h1>
                  <a
                    href="/en"
                    className="text-accent underline text-sm uppercase tracking-widest"
                  >
                    Return Home
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

interface AppProps {
  queryClient: QueryClient;
  /** Set only during SSR: the URL wouter should treat as "current". */
  ssrPath?: string;
}

/** Sanitize Vite BASE_URL — MSYS can rewrite "/" to the Git install path. */
function routerBase(): string {
  const raw = import.meta.env.BASE_URL || '/';
  if (
    !raw.startsWith('/') ||
    raw.includes('Program') ||
    /Git/i.test(raw)
  ) {
    return '';
  }
  return raw.replace(/\/$/, '');
}

function App({ queryClient, ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={routerBase()} ssrPath={ssrPath}>
          <LocaleProvider>
            <Router />
          </LocaleProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
