import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  /** Figma "header" type: section-header-sm (H6, 16px icon) or section-header-lg (H5, 24px icon). */
  size?: 'sm' | 'lg';
  /** Icon before the title. */
  icon?: ReactNode;
  title: ReactNode;
  /** Right side: an icon, a Link ("See more"), etc. */
  trailing?: ReactNode;
  /** Heading level for screen readers; looks the same. */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/** Design-system section header (Figma: Components → Headers → header, type=section-header-sm / -lg). */
export function SectionHeader({ size = 'sm', icon, title, trailing, as: Tag = 'h2', className }: SectionHeaderProps) {
  return (
    <div className={[styles.header, styles[size], className].filter(Boolean).join(' ')}>
      <Tag className={styles.label}>
        {icon}
        {title}
      </Tag>
      {trailing}
    </div>
  );
}
