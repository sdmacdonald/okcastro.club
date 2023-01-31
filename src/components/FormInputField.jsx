import { FormControl, FormHelperText, Input } from "@chakra-ui/react";
import { Label } from "./Label";

export const FormInputField = (props) => {
  const { children, display, helper, name, onChange, rest, type, width } =
    props;

  return (
    <FormControl w={width || "100%"}>
      <Label name={name} />
      <Input as="input" name={name} type={type} onChange={onChange} {...rest} />
      {children}
      <FormHelperText fontSize="xs" color="gray.600" display={display}>
        {helper}
      </FormHelperText>
    </FormControl>
  );
};
