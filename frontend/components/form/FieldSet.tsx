import { FieldGroup, FieldLegend, FieldSeparator, FieldSet as FieldSetBase } from '../ui/field';

export default function FieldSet({
  legend,
  children,
  addSeparator = false,
}: {
  legend: string;
  children: React.ReactNode;
  addSeparator?: boolean;
}) {
  return (
    <>
      <FieldSetBase>
        <FieldLegend>{legend}</FieldLegend>
        <FieldGroup>{children}</FieldGroup>
      </FieldSetBase>
      {addSeparator && <FieldSeparator />}
    </>
  );
}
