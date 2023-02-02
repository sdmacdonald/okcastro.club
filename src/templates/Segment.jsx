import React from "react";
import { Heading, Stack } from "@chakra-ui/react";

export const Segment = (props) => {
  const { as, children, fontSize, fontWeight, heading, rest, top } = props;
  return (
    <Stack w="100%" p={10} m={6} {...rest}>
      {top}
      <Heading as={as} fontSize={fontSize} fontWeight={fontWeight || "thin"}>
        {heading}
      </Heading>
      {children}
    </Stack>
  );
};
