import { Label } from '../label';
import { Switch as SwitchBase, SwitchProps } from '../switch';

export interface CustomSwitchProps extends SwitchProps {
  label?: string;
}

export default function Switch({ label, ...rest }: CustomSwitchProps) {
  return (
    <div className="align-center w-fit! gap-2">
      <SwitchBase {...rest} />
      {label && <Label htmlFor={rest.id}>{label}</Label>}
    </div>
  );
}
