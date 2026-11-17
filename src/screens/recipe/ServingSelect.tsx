import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Select } from '../../components/Select';
import styles from './ServingSelect.module.css';

const OPTIONS = [1, 2, 3].map((n) => ({ value: n, quantity: n, label: 'Serving' }));

interface ServingSelectProps {
  value: number;
  onChange: (servings: number) => void;
}

/** Figma "serving-dropdown container": reset button + the design-system select ("1 SERVING"). */
export function ServingSelect({ value, onChange }: ServingSelectProps) {
  return (
    <div className={styles.serving}>
      <Button variant="outline" size="sm" aria-label="Reset serving" onClick={() => onChange(1)}>
        <Icon name="reset" size={16} />
      </Button>
      <Select value={value} options={OPTIONS} onChange={onChange} ariaLabel={`${value} serving`} />
    </div>
  );
}
