import * as React from 'react';
import { cn } from '@/lib/utils';

const DropdownMenu = ({ trigger, children, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            'absolute right-0 z-50 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in zoom-in-95',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ className, children, onClick, disabled, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const DropdownMenuSeparator = ({ className }) => (
  <div className={cn('-mx-1 my-1 h-px bg-muted', className)} />
);

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator };
