import type { Metadata } from 'next';
import { LeadsTable } from '@/components/admin/LeadsTable';

export const metadata: Metadata = { title: 'Part-ex & valuations' };

const requestTime = () => Date.now();

/** Part-exchange and sell-your-bike submissions (they're leads with the bike details in the form data). */
export default function ValuationsPage() {
  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Part-ex & valuations</h1>
          <p className="adm-muted">Bikes customers want to part-exchange or sell to you. Open one to see the reg, mileage, condition and finance.</p>
        </div>
      </header>
      <LeadsTable
        where={{ type: { in: ['part_exchange', 'sell_bike'] } }}
        now={requestTime()}
        emptyText="No valuations yet. Part-exchange and Sell your bike forms will appear here."
      />
    </>
  );
}
