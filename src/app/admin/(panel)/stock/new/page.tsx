import type { Metadata } from 'next';
import Link from 'next/link';
import { BikeForm } from '@/components/admin/BikeForm';

export const metadata: Metadata = { title: 'Add bike' };

export default function NewBikePage() {
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/stock" className="adm-back">
            ← Stock
          </Link>
          <h1>Add bike</h1>
          <p className="adm-muted">Fill in the details and create the bike. Photos, purchase and costs are added on the next screen.</p>
        </div>
      </header>
      <BikeForm mode="new" values={{ status: 'draft', visible: true, showWarrantyBadge: true }} />
    </>
  );
}
