'use client';

import { useState } from 'react';
import { BookOpen, LayoutGrid, Menu, Moon, Plus, Sparkles, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreatePromptDialog } from '@/components/CreatePromptDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  const navigationItems = [
    { to: '/', label: 'Library', icon: LayoutGrid },
    { to: '/templates', label: 'Templates', icon: Sparkles },
    // { to: "/favorites", label: "Favorites", icon: Star },
    { to: '/help', label: 'Help', icon: BookOpen },
  ] as const;

  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg focus-ring"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-soft">
              <Sparkles className="size-4 text-brand-foreground" aria-hidden />
            </span>
            <span className="hidden text-[17px] font-semibold tracking-tight sm:inline">
              Prompt<span className="text-gradient-brand">Stack</span>
            </span>
          </Link>

          {/* Center content (search, etc.) */}
          <nav aria-label="nav-items" className="mx-auto hidden items-center gap-1 lg:flex">
            {navigationItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                href={to}
                aria-label={label}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 focus-ring',
                  pathname === to
                    ? 'bg-surface-raised text-foreground font-semibold border border-border shadow-xs2'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile nav */}
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation"
                    className="lg:hidden"
                  />
                }
              >
                <Menu aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 rounded-xl">
                {navigationItems.map(({ to, label, icon: Icon }) => (
                  <DropdownMenuItem key={to}>
                    <Link
                      href={to}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 focus-ring',
                        pathname === to
                          ? 'bg-surface-raised text-foreground font-semibold border border-border shadow-xs2'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                      aria-label={label}
                    >
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* <Button
              variant="brand"
              className="hidden sm:inline-flex"
              onClick={() => setOpenDialog(true)}
            >
              <Plus aria-hidden />
              New prompt
            </Button> */}
            {/* <Button
              variant="brand"
              size="icon"
              aria-label="New prompt"
              className="sm:hidden"
              onClick={() => setOpenDialog(true)}
            >
              <Plus aria-hidden />
            </Button> */}

            {/* ToDo: User Account */}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="relative"
            >
              {mounted && theme === 'dark' ? <Moon aria-hidden /> : <Sun aria-hidden />}
            </Button>
          </div>
        </div>
      </header>

      <CreatePromptDialog open={openDialog} close={() => setOpenDialog(false)} />
    </>
  );
}
