import { useState, useEffect, useRef, type ReactNode } from 'react';

export interface NavbarProps {
  /** App logo or name to display */
  logo?: ReactNode;
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
  /** Whether to show hamburger menu button */
  showMenuButton?: boolean;
  /** Whether menu is open (controlled) */
  menuOpen?: boolean;
  /** Callback when menu button is clicked */
  onMenuToggle?: () => void;
}

/**
 * Navigation bar with user menu
 *
 * Displays app logo/name on the left, and either:
 * - User display name with dropdown (profile link and sign out) when authenticated
 * - Sign in button when not authenticated
 */
export function Navbar({
  logo,
  userName,
  avatarUrl,
  onSignOut,
  onSignIn,
  onProfileClick,
  showMenuButton = false,
  menuOpen = false,
  onMenuToggle,
}: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuOpen &&
        userMenuRef.current &&
        userButtonRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Close user menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && userMenuOpen) {
        setUserMenuOpen(false);
        userButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [userMenuOpen]);

  const handleSignOut = () => {
    setUserMenuOpen(false);
    onSignOut?.();
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    onProfileClick?.();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-800 border-b border-gray-700">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Left side: hamburger and logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger menu button (mobile) */}
          {showMenuButton && (
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onMenuToggle}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            {logo || <span className="text-xl font-bold text-white">Duragon</span>}
          </a>
        </div>

        {/* Right side: user menu */}
        <div className="relative">
          {userName ? (
            <>
              <button
                ref={userButtonRef}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-sm hidden sm:inline">{userName}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-t-md"
                    onClick={handleProfileClick}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-b-md"
                    onClick={handleSignOut}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </span>
                  </button>
                </div>
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
  );
}
