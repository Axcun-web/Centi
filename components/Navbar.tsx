"use client"
import Link from 'next/link';
import Logo, { LogoMobile } from './Logo'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn';
import { UserButton } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
];

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b bg-background md:hidden"> {/* <-- UPDATED */}
      <nav className="container mx-auto flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[85vw] max-w-sm" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="sticky  top-0 z-50 hidden border-b bg-background md:block"> 
      <nav className="mx-4 flex items-center justify-between px-8">

        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ link, label, onClick }: { link: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center justify-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}

export default Navbar;
