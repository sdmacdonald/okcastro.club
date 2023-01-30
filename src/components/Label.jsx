import { FormLabel } from "@chakra-ui/react";

export const Label = ({ name }) => {
  return (
    <FormLabel
      as="label"
      htmlFor={name}
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
      color="blue.800"
    >
      {name}:
    </FormLabel>
  );
};
