import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import { Divider } from '@heroui/react';

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred email and password.
        </p>
      </div>
      <Divider />
      <AccountSettingsForm />
    </div>
  );
} 