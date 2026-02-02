import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-2 text-dark">
            {label}
            {props.required && <span className="text-vintage-red ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          dir="auto"
          rows={rows}
          className={`textarea-retro ${error ? 'border-vintage-red' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-vintage-red">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
