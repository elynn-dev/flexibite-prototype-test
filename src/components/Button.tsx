import type { ButtonHTMLAttributes, Ref } from 'react';
import styles from './Button.module.css';

type Variant = 'outline' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Figma "button": outline (light fill, dark border) or dark (filled).
 * sm = 32px tall, md = 42px tall, lg = 52px full-width primary button.
 */
export function Button({ variant = 'outline', size = 'md', className, type = 'button', ...rest }: ButtonProps) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  return <button type={type} className={cls} {...rest} />;
}
