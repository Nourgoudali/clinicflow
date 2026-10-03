import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = ({
  onOpenSidebar,
  title
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu Mobile</span>
        </Button>

        {/* Clean Page Title */}
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
    </header>
  );
};
