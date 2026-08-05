import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { LocaleProvider } from './contexts/LocaleContext';
import { Layout } from './components/Layout';

// Pages
import Home from './pages/home';
import Portfolio from './pages/portfolio';
import ProjectDetail from './pages/portfolio/detail';
import About from './pages/about';
import Services from './pages/services';
import ServiceDetail from './pages/services/detail';
import Journal from './pages/journal';
import JournalDetail from './pages/journal/detail';
import Contact from './pages/contact';

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Redirect root to /en */}
        <Route path="/" component={() => <Redirect to="/en" />} />
        
        {/* EN Routes */}
        <Route path="/en" component={Home} />
        <Route path="/en/portfolio" component={Portfolio} />
        <Route path="/en/portfolio/:slug" component={ProjectDetail} />
        <Route path="/en/about" component={About} />
        <Route path="/en/services" component={Services} />
        <Route path="/en/services/:slug" component={ServiceDetail} />
        <Route path="/en/journal" component={Journal} />
        <Route path="/en/journal/:slug" component={JournalDetail} />
        <Route path="/en/contact" component={Contact} />

        {/* RU Routes */}
        <Route path="/ru" component={Home} />
        <Route path="/ru/portfolio" component={Portfolio} />
        <Route path="/ru/portfolio/:slug" component={ProjectDetail} />
        <Route path="/ru/about" component={About} />
        <Route path="/ru/services" component={Services} />
        <Route path="/ru/services/:slug" component={ServiceDetail} />
        <Route path="/ru/journal" component={Journal} />
        <Route path="/ru/journal/:slug" component={JournalDetail} />
        <Route path="/ru/contact" component={Contact} />

        {/* 404 */}
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-background text-center pt-24">
            <div>
              <h1 className="text-4xl font-serif mb-4 text-foreground">404 Not Found</h1>
              <a href="/en" className="text-accent underline text-sm uppercase tracking-widest">
                Return Home
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}

interface AppProps {
  queryClient: QueryClient;
  /** Set only during SSR: the URL wouter should treat as "current". */
  ssrPath?: string;
}

function App({ queryClient, ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, '')}
          ssrPath={ssrPath}
        >
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
