import { icons } from '../assets/icons';

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size: number;
  className?: string;
}

/** A decorative icon. Put the accessible name on the button around it. */
export function Icon({ name, size, className }: IconProps) {
  return <img src={icons[name]} width={size} height={size} alt="" aria-hidden="true" className={className} />;
}
