/**
 * Phase switch. Phase 1 is the active order; Phase 2 features (prep-stage tracking, delivery price
 * calculator, live GPS delivery tracking, invoices/documents) stay in the code but are hidden.
 * Turn them back on with NEXT_PUBLIC_PHASE2=1 when Phase 2 starts.
 */
export const PHASE2 = process.env.NEXT_PUBLIC_PHASE2 === '1';
