import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn-retro font-sans transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-vintage-orange text-white hover:bg-vintage-yellow',
    secondary: 'bg-white text-dark hover:bg-cream',
    danger: 'bg-vintage-red text-white hover:bg-red-700',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
