"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Kbd } from "@heroui/kbd";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Avatar,
  Input,
} from "@heroui/react";

import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Logo, SearchIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper:
          "bg-background border border-border h-10 group-data-[focus=true]:border-primary",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="pointer-events-none flex-shrink-0 text-muted-foreground" />
      }
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      type="search"
    />
  );

  return (
    <header className="sticky top-0 z-40 w-full rounded-t-xl border-b border-border bg-panel/90 backdrop-blur-md">
      <div className="container flex h-16 items-center px-6">
        <NextLink href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold">{siteConfig.name}</span>
        </NextLink>

        <nav className="ml-10 hidden items-center gap-6 sm:flex">
          {siteConfig.navItems.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </NextLink>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden w-full max-w-xs lg:block">{searchInput}</div>

          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  size="sm"
                  src={profile?.avatar_url || ""}
                  name={
                    profile?.username?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase()
                  }
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">
                    {profile?.username || user.email}
                  </p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={NextLink}
              href="/auth/login"
              variant="flat"       
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
