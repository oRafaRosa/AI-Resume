import { useState } from 'react';
import { AdCreative } from './pages/AdCreative';
import { LandingPage } from './pages/LandingPage';
import { Workspace } from './pages/Workspace';

export function App() {
  const creative = Number(new URLSearchParams(window.location.search).get('creative'));
  const [view, setView] = useState<'landing' | 'workspace'>('landing');

  if (creative === 1 || creative === 2 || creative === 3) {
    return <AdCreative variant={creative} />;
  }

  return view === 'landing'
    ? <LandingPage onStart={() => setView('workspace')} />
    : <Workspace onHome={() => setView('landing')} />;
}
