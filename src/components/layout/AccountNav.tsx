import { Icon } from '@/components/ui/Icon';
import { accountNav } from '@/lib/navigation';
import { AccountSignOut } from '../account/AccountSignOut';
import { NavLink } from './NavLink';

export function AccountNav({ name, customerNo, savedCount }: { name: string; customerNo: string; savedCount: number }) {
  return (
    <nav className="aside" aria-label="My account">
      <div className="who">
        <b>Hi, {name}</b>
        <small>Customer no. {customerNo}</small>
      </div>
      {accountNav.map((item) => (
        <NavLink key={item.href} href={item.href} exact>
          {item.icon && <Icon name={item.icon} />}
          {item.label}
          {item.href === '/account/saved' && savedCount > 0 && <span className="cnt">{savedCount}</span>}
        </NavLink>
      ))}
      <AccountSignOut className="aout">
        <Icon name="logout" />
        Log out
      </AccountSignOut>
    </nav>
  );
}
