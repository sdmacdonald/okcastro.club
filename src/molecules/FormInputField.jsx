import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { Label } from "../components/Label";

export const FormInputField = (props) => {
  const {
    children,
    disabled,
    display,
    helper,
    name,
    onChange,
    placeholder,
    required,
    rest,
    type,
    validate,
    width,
  } = props;

  return (
    <FormControl w={width || "100%"} isRequired={required} isInvalid={validate}>
      <Label name={name} />
      <Input
        as="input"
        disabled={disabled || false}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        variant={(disabled && "filled") || "outline"}
        {...rest}
      />
      {children}
      <FormHelperText fontSize="xs" color="gray.600" display={display}>
        {helper}
      </FormHelperText>
      <FormErrorMessage>{validate}</FormErrorMessage>
    </FormControl>
  );
};
