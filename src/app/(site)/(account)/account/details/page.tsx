import type { Metadata } from 'next';
import { AccountPage } from '@/components/account/AccountPage';
import { ChangePasswordForm, DetailsForm } from '@/components/account/DetailsForms';
import { getAccount } from '@/server/account';

export const metadata: Metadata = { title: 'My details · My account', robots: { index: false } };

export default async function DetailsPage() {
  const { customer, user } = await getAccount();
  return (
    <AccountPage crumb="Details" title="My" em="details">
      <div className="apanel">
        <div className="ph">
          <h3>Details</h3>
          <small>Signed in as {user.email}</small>
        </div>
        <DetailsForm
          c={{
            firstName: customer.firstName,
            lastName: customer.lastName ?? '',
            phone: customer.phone ?? '',
            addressLine1: customer.addressLine1 ?? '',
            town: customer.town ?? '',
            postcode: customer.postcode ?? '',
            marketingConsent: customer.marketingConsent,
          }}
        />
      </div>
      <div className="apanel">
        <div className="ph">
          <h3>Password</h3>
        </div>
        <ChangePasswordForm />
      </div>
    </AccountPage>
  );
}
