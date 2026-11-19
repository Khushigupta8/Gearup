import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { accountNav } from '@/lib/navigation';
import { NavLink } from './NavLink';

export function AccountNav() {
  return (
    <nav className="aside" aria-label="My account">
      <div className="who">
        <b>Hi, Rahim</b>
        <small>Customer no. GU-0000 (sample)</small>
      </div>
      {accountNav.map((item) => (
        <NavLink key={item.href} href={item.href} exact>
          {item.icon && <Icon name={item.icon} />}
          {item.label}
          {item.href === '/account/saved' && <span className="cnt">3</span>}
        </NavLink>
      ))}
      <Link href="/login" className="aout">
        <Icon name="logout" />
        Log out
      </Link>
    </nav>
  );
}
