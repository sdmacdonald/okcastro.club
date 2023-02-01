import React from "react";
import { Heading, Stack } from "@chakra-ui/react";

export const Segment = (props) => {
  const { as, children, fontSize, fontWeight, heading, rest, top } = props;
  return (
    <Stack maxW="lg" w="100%" p={10} {...rest}>
      {top}
      <Heading as={as} fontSize={fontSize} fontWeight={fontWeight}>
        {heading}
      </Heading>
      {children}
    </Stack>
  );
};
