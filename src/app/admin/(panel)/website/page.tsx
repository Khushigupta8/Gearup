import type { Metadata } from 'next';
import { BusinessForm } from '@/components/admin/CmsForms';
import { requireStaff } from '@/server/auth';
import { getBusiness } from '@/server/services/cms';

export const metadata: Metadata = { title: 'Website · Business details' };

export default async function WebsiteBusinessPage() {
  await requireStaff(['manager', 'admin']);
  return <BusinessForm biz={await getBusiness(true)} />;
}
