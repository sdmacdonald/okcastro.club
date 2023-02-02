import { Box, Button, Stack } from "@chakra-ui/react";
import React from "react";

export const Form = ({
  button,
  children,
  loading,
  method,
  name,
  onSubmit,
  rest,
}) => {
  return (
    <form name={name} onSubmit={onSubmit} method={method || "post"} {...rest}>
      <Stack spacing={4}>{children}</Stack>
      <Button
        type="submit"
        w="100%"
        colorScheme="blue"
        mt={6}
        isLoading={loading}
      >
        {button}
      </Button>
      <Box m={1} fontSize="xs" lineHeight="base" color="gray.400">
        Club dues are $36 and renew on April 1. Your first year of membership is
        pro-rated.
      </Box>
    </form>
  );
};
