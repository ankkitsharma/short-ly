'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@repo/ui/components/navigation-menu';
import { Button } from '@repo/ui/components/button';
import { User, Menu, X } from 'lucide-react';
import { UserProfileButton } from './user-profile-button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              short-ly
            </span>
          </Link>

          {/* Desktop Navigation Menu - Hidden on mobile */}
          {/*<div className="hidden md:flex flex-1 justify-center min-w-0">*/}
          {/*  <NavigationMenu className="max-w-full">*/}
          {/*    <NavigationMenuList className="gap-1">*/}
          {/*      /!*<NavigationMenuItem>*!/*/}
          {/*      /!*  <NavigationMenuTrigger className="text-sm">Products</NavigationMenuTrigger>*!/*/}
          {/*      /!*  <NavigationMenuContent>*!/*/}
          {/*      /!*    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">*!/*/}
          {/*      /!*      <li className="row-span-3">*!/*/}
          {/*      /!*        <NavigationMenuLink asChild>*!/*/}
          {/*      /!*          <a*!/*/}
          {/*      /!*            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"*!/*/}
          {/*      /!*            href="/"*!/*/}
          {/*      /!*          >*!/*/}
          {/*      /!*            <div className="mb-2 mt-4 text-lg font-medium">*!/*/}
          {/*      /!*              short-ly*!/*/}
          {/*      /!*            </div>*!/*/}
          {/*      /!*            <p className="text-sm leading-tight text-muted-foreground">*!/*/}
          {/*      /!*              Browse our collection of amazing products*!/*/}
          {/*      /!*            </p>*!/*/}
          {/*      /!*          </a>*!/*/}
          {/*      /!*        </NavigationMenuLink>*!/*/}
          {/*      /!*      </li>*!/*/}
          {/*      /!*      <li>*!/*/}
          {/*      /!*        <NavigationMenuLink asChild>*!/*/}
          {/*      /!*          <a*!/*/}
          {/*      /!*            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"*!/*/}
          {/*      /!*            href="/products/electronics"*!/*/}
          {/*      /!*          >*!/*/}
          {/*      /!*            <div className="text-sm font-medium leading-none">*!/*/}
          {/*      /!*              Electronics*!/*/}
          {/*      /!*            </div>*!/*/}
          {/*      /!*            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">*!/*/}
          {/*      /!*              Latest gadgets and electronics*!/*/}
          {/*      /!*            </p>*!/*/}
          {/*      /!*          </a>*!/*/}
          {/*      /!*        </NavigationMenuLink>*!/*/}
          {/*      /!*      </li>*!/*/}
          {/*      /!*      <li>*!/*/}
          {/*      /!*        <NavigationMenuLink asChild>*!/*/}
          {/*      /!*          <a*!/*/}
          {/*      /!*            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"*!/*/}
          {/*      /!*            href="/products/clothing"*!/*/}
          {/*      /!*          >*!/*/}
          {/*      /!*            <div className="text-sm font-medium leading-none">*!/*/}
          {/*      /!*              Clothing*!/*/}
          {/*      /!*            </div>*!/*/}
          {/*      /!*            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">*!/*/}
          {/*      /!*              Fashion and apparel*!/*/}
          {/*      /!*            </p>*!/*/}
          {/*      /!*          </a>*!/*/}
          {/*      /!*        </NavigationMenuLink>*!/*/}
          {/*      /!*      </li>*!/*/}
          {/*      /!*      <li>*!/*/}
          {/*      /!*        <NavigationMenuLink asChild>*!/*/}
          {/*      /!*          <a*!/*/}
          {/*      /!*            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"*!/*/}
          {/*      /!*            href="/products/books"*!/*/}
          {/*      /!*          >*!/*/}
          {/*      /!*            <div className="text-sm font-medium leading-none">*!/*/}
          {/*      /!*              Books*!/*/}
          {/*      /!*            </div>*!/*/}
          {/*      /!*            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">*!/*/}
          {/*      /!*              Books and literature*!/*/}
          {/*      /!*            </p>*!/*/}
          {/*      /!*          </a>*!/*/}
          {/*      /!*        </NavigationMenuLink>*!/*/}
          {/*      /!*      </li>*!/*/}
          {/*      /!*    </ul>*!/*/}
          {/*      /!*  </NavigationMenuContent>*!/*/}
          {/*      /!*</NavigationMenuItem>*!/*/}
          {/*      /!*<NavigationMenuItem>*!/*/}
          {/*      /!*  <NavigationMenuTrigger className="text-sm">Categories</NavigationMenuTrigger>*!/*/}
          {/*      /!*  <NavigationMenuContent>*!/*/}
          {/*      /!*    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">*!/*/}
          {/*      /!*      <NavigationMenuLink asChild>*!/*/}
          {/*      /!*        <a*!/*/}
          {/*      /!*          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"*!/*/}
          {/*      /!*          href="/categories"*!/*/}
          {/*      /!*        >*!/*/}
          {/*      /!*          <div className="text-sm font-medium leading-none">*!/*/}
          {/*      /!*            All Categories*!/*/}
          {/*      /!*          </div>*!/*/}
          {/*      /!*          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">*!/*/}
          {/*      /!*            Browse all product categories*!/*/}
          {/*      /!*          </p>*!/*/}
          {/*      /!*        </a>*!/*/}
          {/*      /!*      </NavigationMenuLink>*!/*/}
          {/*      /!*      <NavigationMenuLink asChild>*!/*/}
          {/*      /!*        <a*!/*/}
          {/*      /!*          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"*!/*/}
          {/*      /!*          href="/categories/featured"*!/*/}
          {/*      /!*        >*!/*/}
          {/*      /!*          <div className="text-sm font-medium leading-none">*!/*/}
          {/*      /!*            Featured*!/*/}
          {/*      /!*          </div>*!/*/}
          {/*      /!*          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">*!/*/}
          {/*      /!*            Featured products and deals*!/*/}
          {/*      /!*          </p>*!/*/}
          {/*      /!*        </a>*!/*/}
          {/*      /!*      </NavigationMenuLink>*!/*/}
          {/*      /!*    </ul>*!/*/}
          {/*      /!*  </NavigationMenuContent>*!/*/}
          {/*      /!*</NavigationMenuItem>*!/*/}
          {/*    </NavigationMenuList>*/}
          {/*  </NavigationMenu>*/}
          {/*</div>*/}

          {/* Right side buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Menu Button - Visible on mobile only */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Profile Button - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex">
              <UserProfileButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-background border-r transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-semibold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          {/*<div className="flex-1 overflow-y-auto p-4">*/}
          {/*  <nav className="flex flex-col space-y-4">*/}
          {/*    /!* Products Section *!/*/}
          {/*    <div>*/}
          {/*      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">*/}
          {/*        Products*/}
          {/*      </div>*/}
          {/*      <div className="flex flex-col space-y-1">*/}
          {/*        <Link*/}
          {/*          href="/products/electronics"*/}
          {/*          className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"*/}
          {/*          onClick={() => setMobileMenuOpen(false)}*/}
          {/*        >*/}
          {/*          Electronics*/}
          {/*        </Link>*/}
          {/*        <Link*/}
          {/*          href="/products/clothing"*/}
          {/*          className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"*/}
          {/*          onClick={() => setMobileMenuOpen(false)}*/}
          {/*        >*/}
          {/*          Clothing*/}
          {/*        </Link>*/}
          {/*        <Link*/}
          {/*          href="/products/books"*/}
          {/*          className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"*/}
          {/*          onClick={() => setMobileMenuOpen(false)}*/}
          {/*        >*/}
          {/*          Books*/}
          {/*        </Link>*/}
          {/*      </div>*/}
          {/*    </div>*/}

          {/*    /!* Categories Section *!/*/}
          {/*    <div>*/}
          {/*      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">*/}
          {/*        Categories*/}
          {/*      </div>*/}
          {/*      <div className="flex flex-col space-y-1">*/}
          {/*        <Link*/}
          {/*          href="/categories"*/}
          {/*          className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"*/}
          {/*          onClick={() => setMobileMenuOpen(false)}*/}
          {/*        >*/}
          {/*          All Categories*/}
          {/*        </Link>*/}
          {/*        <Link*/}
          {/*          href="/categories/featured"*/}
          {/*          className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"*/}
          {/*          onClick={() => setMobileMenuOpen(false)}*/}
          {/*        >*/}
          {/*          Featured*/}
          {/*        </Link>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </nav>*/}
          {/*</div>*/}

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-center">
              <UserProfileButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
