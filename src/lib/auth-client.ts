'use client';

import { createAuthClient } from 'better-auth/react';

/** Browser-side auth: signIn.email, signUp.email, signOut, useSession. */
export const authClient = createAuthClient();
