import { permanentRedirect } from 'next/navigation';

/** Moved under /legal (all policies live there now). */
export default function Moved() {
  permanentRedirect('/legal/complaints');
}
