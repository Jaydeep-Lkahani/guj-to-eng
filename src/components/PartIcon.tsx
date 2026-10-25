import { Footprints, Mountains, Plant, type IconProps } from "@phosphor-icons/react";

// Part 1 = a sprout (starting out), Part 2 = footsteps (moving on), Part 3 = a mountain (mastery).
const icons = [Plant, Footprints, Mountains];

export function PartIcon({ number, ...props }: { number: number } & IconProps) {
  const Icon = icons[number - 1] ?? Plant;
  return <Icon weight="duotone" aria-hidden="true" {...props} />;
}
