'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

export function AccountSignOut({ className, style, children }: { className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const router = useRouter();
  return (
    <a
      href="/login"
      className={className}
      style={style}
      onClick={async (e) => {
        e.preventDefault();
        await authClient.signOut();
        router.replace('/login');
        router.refresh();
      }}
    >
      {children}
    </a>
  );
}
