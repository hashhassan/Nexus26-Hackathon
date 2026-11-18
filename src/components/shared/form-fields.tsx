import type { ComponentProps } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BaseFieldProps = {
  label: string;
  name: string;
  /** Error message; also marks the field invalid. */
  error?: string;
  description?: string;
};

export function InputField({
  label,
  name,
  error,
  description,
  id,
  ...props
}: BaseFieldProps & Omit<ComponentProps<typeof Input>, "name">) {
  const fieldId = id ?? name;
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input id={fieldId} name={name} aria-invalid={!!error} {...props} />
      {description && !error ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

export function TextareaField({
  label,
  name,
  error,
  description,
  id,
  ...props
}: BaseFieldProps & Omit<ComponentProps<typeof Textarea>, "name">) {
  const fieldId = id ?? name;
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Textarea id={fieldId} name={name} aria-invalid={!!error} {...props} />
      {description && !error ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

export type SelectOption = { value: string; label: string };

type SelectFieldProps = BaseFieldProps & {
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string | null) => void;
};

export function SelectField({
  label,
  name,
  error,
  description,
  options,
  placeholder = "Select an option",
  defaultValue,
  value,
  onValueChange,
}: SelectFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select
        name={name}
        items={options}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger id={name} className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && !error ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
