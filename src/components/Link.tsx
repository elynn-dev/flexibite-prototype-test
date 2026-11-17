import type { ButtonHTMLAttributes } from 'react';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'outline-all' | 'outline-bottom';

interface LinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma "variant": default = dark fill, outline-all = border all round, outline-bottom = underline only. */
  variant: LinkVariant;
  /** Figma "link-small" (32px) or "link- medium" (42px). */
  size?: 'sm' | 'md';
  /** Selected tab / current page (shows the action state). */
  current?: boolean;
}

/**
 * Design-system Link (Figma: Components → Link). Used for text actions like "See more", "Undo"
 * and for tabs (outline-bottom). States map to CSS like Button.
 */
export function Link({ variant, size = 'sm', current, className, type = 'button', ...rest }: LinkProps) {
  const cls = [styles.link, styles[variant], styles[size], current ? styles.current : '', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} aria-current={current || undefined} {...rest} />;
}
