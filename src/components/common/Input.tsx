import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-2 text-dark">
            {label}
            {props.required && <span className="text-vintage-red ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          dir="auto"
          className={`input-retro ${error ? 'border-vintage-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-vintage-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
