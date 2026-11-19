'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="adm-link-btn"
      onClick={async () => {
        await authClient.signOut();
        router.replace('/admin/login');
      }}
    >
      Sign out
    </button>
  );
}
