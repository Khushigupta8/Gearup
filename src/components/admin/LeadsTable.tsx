import Link from 'next/link';
import type { Prisma } from '@/generated/prisma/client';
import { leadStages, leadTypes, timeAgo } from '@/lib/crm';
import { db } from '@/server/db';

type Props = { where?: Prisma.LeadWhereInput; now: number; emptyText?: string };

/** Lead list used by Leads, Valuations and the dashboard. */
export async function LeadsTable({ where, now, emptyText = 'No leads yet. Website form submissions will appear here.' }: Props) {
  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { customer: true, assignedTo: { select: { name: true } }, bike: { select: { year: true, make: true, model: true } } },
  });

  if (!leads.length) return <p className="adm-empty">{emptyText}</p>;

  return (
    <div className="adm-card adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Type</th>
            <th>Customer</th>
            <th>About</th>
            <th>Stage</th>
            <th>Owner</th>
            <th>Follow up</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const name = [l.customer.firstName, l.customer.lastName].filter(Boolean).join(' ');
            const due = l.followUpAt && l.followUpAt.getTime() <= now && !['won', 'lost'].includes(l.stage);
            const about = l.bike ? `${l.bike.year} ${l.bike.make} ${l.bike.model}` : (l.message ?? '').slice(0, 60);
            return (
              <tr key={l.id} className={l.stage === 'new' ? 'is-new' : undefined}>
                <td className="adm-nowrap">
                  <Link href={`/admin/leads/${l.id}`} className="adm-rowlink">
                    {timeAgo(l.createdAt, now)}
                  </Link>
                </td>
                <td>
                  <span className={`adm-type t-${l.type}`}>{leadTypes[l.type]}</span>
                </td>
                <td>
                  <Link href={`/admin/leads/${l.id}`} className="adm-rowlink">
                    <b>{name}</b>
                  </Link>
                  <small className="adm-sub">{l.customer.email ?? l.customer.phone}</small>
                </td>
                <td className="adm-about">{about}</td>
                <td>
                  <span className={`adm-stage st-${l.stage}`}>{leadStages[l.stage]}</span>
                </td>
                <td>{l.assignedTo?.name ?? <span className="adm-muted">Unassigned</span>}</td>
                <td className={due ? 'adm-due' : undefined}>{l.followUpAt ? l.followUpAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
