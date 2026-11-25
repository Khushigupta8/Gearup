import 'server-only';

/**
 * Transactional email through Resend's HTTP API (no SDK).
 * Needs RESEND_API_KEY. Without it, emails are skipped and logged, so forms still work.
 * MAIL_FROM must be on a domain verified in Resend (e.g. "GearUp Motorcycles <hello@gearupmotorcycles.co.uk>").
 */

type Mail = { to: string | string[]; subject: string; html: string; text: string; replyTo?: string };

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.MAIL_FROM?.trim());
}

export async function sendEmail(mail: Mail): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!emailConfigured()) {
    console.info(`[email skipped: configure RESEND_API_KEY and MAIL_FROM] ${mail.subject}`);
    return { sent: false, error: 'not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [mail.to].flat(),
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) {
      const error = `${res.status} ${await res.text()}`;
      console.error('[email failed]', error);
      return { sent: false, error };
    }
    return { sent: true };
  } catch (e) {
    console.error('[email failed]', e);
    return { sent: false, error: String(e) };
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Simple branded email: heading, paragraphs and an optional key/value table. */
export function renderEmail({ heading, paragraphs, rows, cta }: { heading: string; paragraphs: string[]; rows?: [string, string][]; cta?: { label: string; href: string } }) {
  const table = rows?.length
    ? `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#64646b;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#0b0b0d">${esc(v).replace(/\n/g, '<br>')}</td></tr>`,
        )
        .join('')}</table>`
    : '';
  const button = cta
    ? `<p style="margin:22px 0"><a href="${esc(cta.href)}" style="background:#E1141B;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px;display:inline-block">${esc(cta.label)}</a></p>`
    : '';
  const html = `<!doctype html><html><body style="margin:0;background:#f4f3ef;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:24px 16px">
<div style="background:#0b0b0d;padding:16px 22px;border-radius:12px 12px 0 0"><span style="color:#fff;font-weight:700;font-size:18px;letter-spacing:.04em">GEARUP</span> <span style="color:#E1141B;font-weight:700;font-size:12px;letter-spacing:.12em">MOTORCYCLES</span></div>
<div style="background:#fff;padding:24px 22px;border-radius:0 0 12px 12px;color:#141416;font-size:15px;line-height:1.55">
<h1 style="font-size:22px;margin:0 0 12px">${esc(heading)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 12px">${esc(p)}</p>`).join('')}
${table}${button}
</div>
<p style="color:#8e8e96;font-size:12px;text-align:center;margin:14px 0 0">GearUp Motorcycles · 0744 072 1478 · sales@gearupmotorcycles.co.uk</p>
</div></body></html>`;
  const text = [heading, '', ...paragraphs, '', ...(rows ?? []).map(([k, v]) => `${k}: ${v}`), cta ? `\n${cta.label}: ${cta.href}` : ''].join('\n');
  return { html, text };
}
