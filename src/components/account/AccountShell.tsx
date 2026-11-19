import type { ReactNode } from 'react';
import { AccountNav } from '@/components/layout/AccountNav';

/** Side menu + content column used by every /account page (below its own hero). */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <section className="sec paper" style={{ paddingTop: 34 }}>
      <div className="wrap acct">
        <AccountNav />
        <div>{children}</div>
      </div>
    </section>
  );
}
