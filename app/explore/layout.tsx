import { Suspense, ReactNode } from 'react';

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-void" />}>{children}</Suspense>;
}
