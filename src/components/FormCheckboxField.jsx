import React, { useState } from "react";
import { Checkbox, FormControl, FormLabel } from "@chakra-ui/react";

const styles = { formLabel: { color: "blue.800" } };

export const FormCheckboxField = ({ name, onChange, value }) => {
  // Needs check state

  const [checked, isChecked] = useState(false);
  return (
    <FormControl>
      <FormLabel
        as="label"
        htmlFor={name}
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
        {...styles.formLabel}
      >
        {name}:
      </FormLabel>
      <Checkbox
        name={name}
        value={isChecked}
        isChecked={checked}
        onChange={onChange}
      />
    </FormControl>
  );
};
