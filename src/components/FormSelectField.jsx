import { FormControl, Select } from "@chakra-ui/react";
import React from "react";
import { Label } from "./Label";

export const FormSelectField = ({ name, onChange, options, placeholder }) => {
  return (
    <FormControl>
      <Label name={name} />
      <Select name={name} defaultValue={placeholder} onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
