import type { ReactNode } from 'react';

/**
 * Full-page backdrop: mesh gradient, dot texture, soft blobs.
 * Use with Header + main + Footer (same pattern as Index).
 */
export function AppPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-mesh bg-dot-pattern">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-accent/[0.06] blur-3xl" />
      </div>
      {children}
    </div>
  );
}
