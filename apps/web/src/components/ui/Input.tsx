import { forwardRef, type InputHTMLAttributes, useId } from 'react';

export type InputType = 'text' | 'email' | 'password' | 'number';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Input type */
  type?: InputType;
  /** Label text displayed above the input */
  label?: string;
  /** Error message to display below the input */
  error?: string;
}

/**
 * Input component with label and validation error display
 * Supports text, email, password, and number types
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      disabled,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            block w-full px-3 py-2
            bg-gray-800 border rounded-md
            text-gray-100 placeholder-gray-500
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-900' : ''}
            ${className}
          `
            .trim()
            .replace(/\s+/g, ' ')}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
