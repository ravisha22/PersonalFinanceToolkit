import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';

// Calculators — each lazy-imported to keep initial bundle small
import { lazy, Suspense } from 'react';

const OffsetVsDR        = lazy(() => import('./calculators/offset-vs-dr/OffsetVsDR').then(m => ({ default: m.OffsetVsDR })));
const DirectVsDR        = lazy(() => import('./calculators/direct-vs-dr/DirectVsDR').then(m => ({ default: m.DirectVsDR })));
const TaxSavingsGuide   = lazy(() => import('./calculators/tax-savings/TaxSavingsGuide').then(m => ({ default: m.TaxSavingsGuide })));
const HouseAffordability = lazy(() => import('./calculators/house-affordability/HouseAffordability').then(m => ({ default: m.HouseAffordability })));
const FIREDashboard     = lazy(() => import('./calculators/fire/FIREDashboard').then(m => ({ default: m.FIREDashboard })));
const InvestmentCompare = lazy(() => import('./calculators/investment-compare/InvestmentCompare').then(m => ({ default: m.InvestmentCompare })));
const SavingsRate       = lazy(() => import('./calculators/savings-rate/SavingsRate').then(m => ({ default: m.SavingsRate })));
const PropertyResearch  = lazy(() => import('./calculators/property-research/PropertyResearch').then(m => ({ default: m.PropertyResearch })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-64 text-slate-400 text-sm">
      Loading…
    </div>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'offset-vs-dr',        element: <Wrap><OffsetVsDR /></Wrap> },
      { path: 'direct-vs-dr',        element: <Wrap><DirectVsDR /></Wrap> },
      { path: 'tax-savings',         element: <Wrap><TaxSavingsGuide /></Wrap> },
      { path: 'house-affordability', element: <Wrap><HouseAffordability /></Wrap> },
      { path: 'fire',                element: <Wrap><FIREDashboard /></Wrap> },
      { path: 'investment-compare',  element: <Wrap><InvestmentCompare /></Wrap> },
      { path: 'savings-rate',        element: <Wrap><SavingsRate /></Wrap> },
      { path: 'property-research',   element: <Wrap><PropertyResearch /></Wrap> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
