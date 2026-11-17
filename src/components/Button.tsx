import type { ButtonHTMLAttributes, Ref } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'default' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma "variant": default = dark fill, outline = light fill with a border. */
  variant: ButtonVariant;
  /** Figma "button- small" (32px), "button- medium" (42px), "button- large" (52px, full width). */
  size?: ButtonSize;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Design-system Button (Figma: Components → Buttons).
 * The Figma "state" property maps to CSS: default, :hover, :active (action), :focus-visible, :disabled.
 * A button with only an icon inside becomes square.
 */
export function Button({ variant, size = 'md', className, type = 'button', ...rest }: ButtonProps) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  return <button type={type} className={cls} {...rest} />;
}
