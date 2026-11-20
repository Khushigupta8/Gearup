import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

/**
 * CMS text formatting (kept deliberately small):
 *   [label](/link)  link        **bold**  bold
 *   ## Heading      heading     - item    bullet list (one per line)
 *   blank line      new paragraph
 */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[3] !== undefined) {
      out.push(<strong key={m.index}>{m[3]}</strong>);
    } else {
      const [, label, href] = m;
      out.push(
        href.startsWith('/') ? (
          <Link key={m.index} href={href}>
            {label}
          </Link>
        ) : (
          <a key={m.index} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
            {label}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        if (/^#{1,3} /.test(b)) return <h2 key={i}>{b.replace(/^#{1,3} /, '')}</h2>;
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*] /, ''))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
