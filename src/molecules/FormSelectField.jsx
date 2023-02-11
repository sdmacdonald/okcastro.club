import { FormControl, Select } from "@chakra-ui/react";
import React from "react";
import { Label } from "../components/Label";

export const FormSelectField = (props) => {
  const { disabled, name, placeholder, onChange, options, rest } = props;
  return (
    <FormControl>
      <Label name={name} />
      <Select
        defaultValue={placeholder}
        disabled={disabled || false}
        name={name}
        color="gray.400"
        onChange={onChange}
        variant={(disabled && "filled") || "outline"}
        {...rest}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
