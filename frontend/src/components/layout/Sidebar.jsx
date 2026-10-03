import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Activity,
  LogOut,
  ShieldCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  onClose,
  isMobile = false
}) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard
    },
    {
      to: '/patients',
      label: 'Patients',
      icon: Users
    },
    {
      to: '/appointments',
      label: 'Rendez-vous',
      icon: CalendarCheck
    }
  ];

  return (
    <aside
      className={`flex h-full flex-col border-r bg-card text-card-foreground transition-all duration-300 ease-in-out ${
        isMobile
          ? 'w-64'
          : isCollapsed
          ? 'w-20'
          : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-border/60 px-3">
        {!isCollapsed || isMobile ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Activity className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="truncate">
                <span className="text-base font-bold tracking-tight text-foreground block leading-tight truncate">
                  ClinicFlow
                </span>
                <span className="text-[11px] font-medium text-muted-foreground block truncate">
                  Gestion Clinique
                </span>
              </div>
            </div>

            {!isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 ml-1"
                title="Replier la barre latérale"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Replier la barre latérale</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                title="Fermer"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Fermer</span>
              </Button>
            )}
          </div>
        ) : (
          /* Collapsed Header: Centered Full Logo and Expand Button */
          <div className="flex w-full items-center justify-center relative">
            <button
              onClick={onToggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-opacity focus:outline-none"
              title="ClinicFlow - Cliquer pour déplier"
            >
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="absolute -right-2 top-1 h-5 w-5 rounded-full border bg-background shadow-xs text-muted-foreground hover:text-foreground p-0 hidden lg:flex items-center justify-center"
              title="Déplier la barre latérale"
            >
              <ChevronRight className="h-3 w-3" />
              <span className="sr-only">Déplier</span>
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {(!isCollapsed || isMobile) && (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Menu Principal
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              title={isCollapsed && !isMobile ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  isCollapsed && !isMobile
                    ? 'justify-center px-0'
                    : 'px-3'
                } ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`
              }
            >
              <Icon className={`${isCollapsed && !isMobile ? 'h-5 w-5' : 'h-4 w-4'} shrink-0`} />
              {(!isCollapsed || isMobile) && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User profile & Logout Footer */}
      <div className="p-3 border-t border-border/60 bg-muted/20">
        {(!isCollapsed || isMobile) ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
                  {user?.email?.slice(0, 2) || 'CF'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[130px]" title={user?.email}>
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isAdmin ? (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-purple-600 hover:bg-purple-700">
                        <ShieldCheck className="h-3 w-3 mr-0.5 inline" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                        <UserCheck className="h-3 w-3 mr-0.5 inline" />
                        Staff
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="w-full justify-center gap-2 text-xs hover:bg-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase"
              title={`${user?.email} (${user?.role})`}
            >
              {user?.email?.slice(0, 2) || 'CF'}
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={logout}
              className="h-8 w-8 hover:bg-destructive"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
