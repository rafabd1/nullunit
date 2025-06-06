/* eslint-disable react/jsx-sort-props */
"use client";
/* eslint-disable import/order */
import React, { useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@heroui/navbar';
import { Input, Kbd, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from '@heroui/react';
import { SearchIcon, Logo } from '@/components/icons';
import { useAuth } from '@/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Articles', href: '/articles' },
    { label: 'Courses', href: '/courses' },
    { label: 'Projects', href: '/portfolio' },
  ];

  const searchInput = (
    <Input
      ref={inputRef}
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
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
    <HeroUINavbar maxWidth="xl" position="sticky" className="bg-transparent py-4">
      <NavbarContent as="div" className="items-center" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Logo />
            <p className="font-bold text-inherit">Null.Unit</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="hidden sm:flex items-center" justify="center">
        {navLinks.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink href={item.href} className="px-3 py-2 text-sm text-default-600 hover:text-primary transition-colors">
                  {item.label}
              </NextLink>
            </NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem>
          {user ? (
             <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  size="sm"
                  src={profile?.avatar_url || ''}
                  name={profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{profile?.username || user.email}</p>
                </DropdownItem>
                <DropdownItem key="settings" onClick={() => router.push('/settings')}>
                  Settings
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button as={NextLink} color="primary" href="/auth/login" variant="flat">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
