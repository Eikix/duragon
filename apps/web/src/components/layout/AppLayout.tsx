import { useState, type ReactNode } from 'react';

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
  /** Callback when sign out is clicked */
  onSignOut?: () => void;
  /** Callback when sign in is clicked */
  onSignIn?: () => void;
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
  onSignOut,
  onSignIn,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNavClick = (item: NavItem) => {
    onNavClick?.(item);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-800 border-b border-gray-700">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Left side: hamburger and logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu button (mobile) */}
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Duragon</span>
            </a>
          </div>

          {/* Right side: user menu */}
          <div className="relative">
            {userName ? (
              <>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="text-sm">{userName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </a>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onSignOut?.();
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                type="button"
                className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={onSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

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
