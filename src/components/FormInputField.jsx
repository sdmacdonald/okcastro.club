import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Label } from "./Label";

export const FormInputField = ({
  children,
  name,
  onChange,
  placeholder,
  type,
  value,
  width,
}) => {
  return (
    <FormControl w={width || "100%"}>
      <Label name={name} />
      <Input
        as="input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {children}
    </FormControl>
  );
};
