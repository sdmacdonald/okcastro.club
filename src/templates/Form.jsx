import { Button, Stack } from "@chakra-ui/react";
import React from "react";

export const Form = ({ button, children, method, name, onSubmit, rest }) => {
  return (
    <form name={name} onSubmit={onSubmit} method={method || "post"} {...rest}>
      <Stack spacing={8}>{children}</Stack>
      <Button type="submit" w="100%" colorScheme="blue" mt={12}>
        {button}
      </Button>
    </form>
  );
};
