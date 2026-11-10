import { useEffect } from 'react';
import type { Toast } from '../data/types';
import { Icon } from './Icon';
import styles from './ToastMessage.module.css';

interface ToastMessageProps {
  toast: Toast | null;
  onDismiss: () => void;
  onUndo?: () => void;
}

/** Figma "toast": a small rounded status pill (hint = purple, ok = green, fail = red). */
export function ToastMessage({ toast, onDismiss, onUndo }: ToastMessageProps) {
  useEffect(() => {
    if (!toast?.durationMs) return;
    const t = setTimeout(onDismiss, toast.durationMs);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={styles.slot}>
      <div className={`${styles.toast} ${styles[toast.kind]} label-xs-bold-upper`} role="status">
        <span>{toast.text}</span>
        {toast.undo && onUndo && (
          <button type="button" className={styles.undo} aria-label="Undo delete" onClick={onUndo}>
            <Icon name="undo" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
