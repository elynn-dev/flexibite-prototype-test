import { icons } from '../assets/icons';
import styles from './PageHeader.module.css';

/** Figma "header" (type=page-header): avatar + greeting on the left, notifications bell on the right. */
export function PageHeader({ name = 'name', onNotifications }: { name?: string; onNotifications?: () => void }) {
  return (
    <header className={styles.header}>
      <div className={`${styles.profile} label-md-regular-upper`}>
        <span className={styles.avatar} aria-hidden="true" />
        <span>Hello, {name}</span>
      </div>
      <button type="button" className={styles.bell} aria-label="Notifications" onClick={onNotifications}>
        {/* The bell's red dot sits slightly outside its 24px box, as in Figma. */}
        <img src={icons.notification} alt="" className={styles.bellIcon} />
      </button>
    </header>
  );
}
