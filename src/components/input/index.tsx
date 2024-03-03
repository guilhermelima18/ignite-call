import { TextInput } from "@ignite-ui/react";
import { Controller } from "react-hook-form";

type InputProps = {
  name: string;
  control: any;
  prefix?: string;
  hasPrefix: boolean;
  placeholder: string;
};

export function Input({
  name,
  control,
  prefix = "ignite.com/",
  hasPrefix,
  placeholder,
}: InputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <TextInput
          size="sm"
          prefix={hasPrefix ? prefix : ""}
          placeholder={placeholder}
          crossOrigin={undefined}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
}
