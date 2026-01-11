import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'white' | 'gray';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color variant of the spinner */
  color?: SpinnerColor;
  /** Accessible label for screen readers */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses: Record<SpinnerColor, { track: string; spinner: string }> = {
  primary: {
    track: 'text-blue-900',
    spinner: 'text-blue-500',
  },
  white: {
    track: 'text-gray-600',
    spinner: 'text-white',
  },
  gray: {
    track: 'text-gray-700',
    spinner: 'text-gray-400',
  },
};

/**
 * LoadingSpinner component for indicating loading states
 * Supports multiple sizes and color variants
 */
export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  label = 'Loading',
  className = '',
  ...props
}: LoadingSpinnerProps) {
  const colors = colorClasses[color];

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <svg
        className={`animate-spin ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className={`opacity-25 ${colors.track}`}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={colors.spinner}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner in the overlay */
  spinnerSize?: SpinnerSize;
  /** Optional message to display below the spinner */
  message?: string;
}

/**
 * Full-page loading overlay with centered spinner
 * Covers the entire viewport with a semi-transparent backdrop
 */
export function LoadingOverlay({
  spinnerSize = 'xl',
  message,
  className = '',
  ...props
}: LoadingOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm ${className}`}
      role="status"
      aria-label={message || 'Loading'}
      {...props}
    >
      <LoadingSpinner size={spinnerSize} color="primary" />
      {message && (
        <p className="mt-4 text-gray-300 text-sm">{message}</p>
      )}
    </div>
  );
}
