import type { Metadata } from 'next';
import { AccountPage } from '@/components/account/AccountPage';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getAccount } from '@/server/account';
import { db } from '@/server/db';

export const metadata: Metadata = {
  title: 'Documents · My account',
  description: 'Your receipts, HPI report, MOT certificate, inspection report, invoice and warranty.',
  robots: { index: false },
};

export default async function DocumentsPage() {
  const { customer } = await getAccount();
  const payments = await db.payment.findMany({
    where: { order: { customerId: customer.id }, status: 'succeeded' },
    orderBy: { createdAt: 'desc' },
    include: { order: { select: { reference: true } } },
  });

  const later: [IconName, string, string][] = [
    ['shield', 'HPI report', 'Added when your bike is reserved'],
    ['award', 'MOT certificate', 'After the fresh MOT'],
    ['wrench', '120-point report', 'When the inspection is done'],
    ['card', 'Invoice', 'When the balance is paid'],
    ['shield', 'Warranty', 'Starts on collection or delivery'],
  ];

  return (
    <AccountPage crumb="Documents" title="My" em="documents">
      <div className="apanel">
        <div className="ph">
          <h3>Documents</h3>
          <small>Saved here for good. Download any time.</small>
        </div>
        <div className="docs">
          {payments.map((p) =>
            p.receiptUrl ? (
              <a key={p.id} href={p.receiptUrl} target="_blank" rel="noopener">
                <Icon name="doc" />
                <span>
                  Payment receipt, {p.order.reference}
                  <small>{p.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small>
                </span>
              </a>
            ) : (
              <span key={p.id} className="doc-item">
                <Icon name="doc" />
                <span>
                  Payment {p.order.reference}
                  <small>Receipt emailed {p.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small>
                </span>
              </span>
            ),
          )}
          {later.map(([icon, title, when]) => (
            <span key={title} className="doc-item" style={{ color: 'var(--mut)' }}>
              <Icon name={icon} />
              <span>
                {title}
                <small>{when}</small>
              </span>
            </span>
          ))}
        </div>
      </div>
    </AccountPage>
  );
}
