'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    disabled?: boolean;
  }[];
}

export function SettingsNav({ className, items, ...props }: SettingsNavProps) {
  const pathname = usePathname();

  // Helper function to combine class names, a simplified version of `cn`
  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.disabled ? '#' : item.href}
          className={cn(
            'w-full text-left justify-start px-4 py-2 rounded-md text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-default-200 text-foreground'
              : 'hover:bg-default-100 hover:text-foreground text-default-600',
            item.disabled ? 'cursor-not-allowed opacity-50' : ''
          )}
          aria-disabled={item.disabled}
          tabIndex={item.disabled ? -1 : undefined}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 