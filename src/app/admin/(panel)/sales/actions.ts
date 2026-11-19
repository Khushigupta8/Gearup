'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { BIKES_TAG } from '@/server/services/bikes';
import { PRODUCTS_TAG } from '@/server/services/shop';

/** Tick or untick a prep stage. The customer's "Track my bike" page updates straight away. */
export async function setStage(orderId: string, templateId: string, done: boolean) {
  const user = await requireStaff();
  await db.orderStage.upsert({
    where: { orderId_templateId: { orderId, templateId } },
    create: { orderId, templateId, doneAt: done ? new Date() : null, doneById: user.id },
    update: { doneAt: done ? new Date() : null, doneById: user.id },
  });
  // First stage done after the deposit → bike is in preparation.
  await db.order.updateMany({ where: { id: orderId, status: 'reserved' }, data: { status: 'in_preparation' } });
  revalidatePath(`/admin/sales/${orderId}`);
}

const statuses = ['reserved', 'in_preparation', 'ready', 'out_for_delivery', 'completed', 'cancelled', 'refunded'] as const;

export async function setOrderStatus(orderId: string, status: (typeof statuses)[number]) {
  const user = await requireStaff();
  z.enum(statuses).parse(status);
  const order = await db.order.findUnique({ where: { id: orderId }, include: { bike: true, items: true } });
  if (!order) return;
  await db.order.update({ where: { id: orderId }, data: { status } });

  // Cancelling a paid order puts its kit back into stock (once).
  const wasLive = !['cancelled', 'refunded', 'pending_payment'].includes(order.status);
  if ((status === 'cancelled' || status === 'refunded') && wasLive && order.items.length) {
    await db.$transaction(
      order.items.filter((i) => i.variantId).map((i) => db.productVariant.update({ where: { id: i.variantId! }, data: { stockQty: { increment: i.quantity } } })),
    );
    updateTag(PRODUCTS_TAG);
  }

  if (order.bike) {
    if (status === 'completed') {
      // Sale done: the bike is sold to this customer.
      await db.bike.update({ where: { id: order.bike.id }, data: { status: 'sold', soldAt: new Date(), soldPrice: order.bike.price, buyerId: order.customerId } });
    }
    if ((status === 'cancelled' || status === 'refunded') && order.bike.status === 'reserved') {
      // Put the bike back on sale.
      await db.bike.update({ where: { id: order.bike.id }, data: { status: 'available', reservedAt: null } });
    }
    updateTag(BIKES_TAG);
  }
  await db.auditLog.create({ data: { userId: user.id, action: `order.${status}`, entity: 'order', entityId: orderId } });
  revalidatePath(`/admin/sales/${orderId}`);
  revalidatePath('/admin/sales');
}

export async function saveOrderNotes(orderId: string, notes: string) {
  await requireStaff();
  await db.order.update({ where: { id: orderId }, data: { notes: notes.slice(0, 5000) || null } });
  revalidatePath(`/admin/sales/${orderId}`);
}
