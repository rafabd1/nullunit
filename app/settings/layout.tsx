import { SettingsNav } from '@/components/settings/SettingsNav';
import { Divider } from '@heroui/react';

export const metadata = {
  title: 'Settings',
  description: 'Manage your account and profile settings.',
};

const settingsNavItems = [
  {
    title: 'Profile',
    href: '/settings',
  },
  {
    title: 'Account',
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    disabled: true, // Example for a future item
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    disabled: true, // Example for a future item
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 max-w-6xl">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Divider className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsNav items={settingsNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
} 