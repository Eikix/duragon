import { useState, type ReactNode } from 'react';
import { Navbar } from './Navbar';

export interface NavItem {
  /** Unique identifier for the nav item */
  id: string;
  /** Display label for the nav item */
  label: string;
  /** Icon element to display (optional) */
  icon?: ReactNode;
  /** URL to navigate to */
  href: string;
  /** Whether this is the active nav item */
  active?: boolean;
}

export interface AppLayoutProps {
  /** Content to display in the main area */
  children: ReactNode;
  /** Navigation items for the sidebar */
  navItems?: NavItem[];
  /** Currently active nav item id */
  activeNavId?: string;
  /** Callback when nav item is clicked */
  onNavClick?: (item: NavItem) => void;
  /** User display name (if authenticated) */
  userName?: string;
  /** User avatar URL (optional) */
  avatarUrl?: string;
  /** Callback when sign out is clicked */
  onSignOut?: () => void;
  /** Callback when sign in is clicked */
  onSignIn?: () => void;
  /** Callback when profile is clicked */
  onProfileClick?: () => void;
  /** Custom logo element */
  logo?: ReactNode;
}

/**
 * Main application layout with navbar and responsive sidebar
 */
export function AppLayout({
  children,
  navItems = [],
  activeNavId,
  onNavClick,
  userName,
  avatarUrl,
  onSignOut,
  onSignIn,
  onProfileClick,
  logo,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (item: NavItem) => {
    onNavClick?.(item);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navbar */}
      <Navbar
        logo={logo}
        userName={userName}
        avatarUrl={avatarUrl}
        onSignOut={onSignOut}
        onSignIn={onSignIn}
        onProfileClick={onProfileClick}
        showMenuButton={navItems.length > 0}
        menuOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 bottom-0 left-0 z-30 w-64 bg-gray-800 border-r border-gray-700
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `.trim().replace(/\s+/g, ' ')}
      >
        <nav className="p-4">
          {navItems.length > 0 ? (
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.active || item.id === activeNavId;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                        transition-colors duration-150
                        ${isActive
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }
                      `.trim().replace(/\s+/g, ' ')}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.icon && (
                        <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm px-3">No navigation items</p>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 pt-14">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
