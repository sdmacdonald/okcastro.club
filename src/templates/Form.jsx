import { Button, Stack } from "@chakra-ui/react";
import React from "react";

export const Form = ({ button, children, method, name, onSubmit, rest }) => {
  return (
    <form name={name} onSubmit={onSubmit} method={method || "post"} {...rest}>
      <Stack p={8} spacing={8}>
        {children}
        <Button type="submit" w="100%" colorScheme="blue">
          {button}
        </Button>
      </Stack>
    </form>
  );
};
