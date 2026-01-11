import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content for the card header section */
  header?: ReactNode;
  /** Content for the card footer section */
  footer?: ReactNode;
  /** Main content of the card */
  children?: ReactNode;
  /** Whether the card should show hover effects (for clickable cards) */
  hoverable?: boolean;
}

/**
 * Card component for content containers
 * Supports optional header, body, and footer sections
 * Can be made hoverable for clickable cards
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      header,
      footer,
      children,
      hoverable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          bg-gray-800 border border-gray-700 rounded-lg
          ${hoverable ? 'transition-colors duration-150 hover:border-gray-600 hover:bg-gray-750 cursor-pointer' : ''}
          ${className}
        `
          .trim()
          .replace(/\s+/g, ' ')}
        {...props}
      >
        {header && (
          <div className="px-4 py-3 border-b border-gray-700">
            {header}
          </div>
        )}
        {children && (
          <div className="px-4 py-4">
            {children}
          </div>
        )}
        {footer && (
          <div className="px-4 py-3 border-t border-gray-700">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
