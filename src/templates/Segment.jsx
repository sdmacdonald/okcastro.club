import React from "react";
import { Box, Divider, Heading } from "@chakra-ui/react";

export const Segment = (props) => {
  const { as, children, color, heading, id, rest } = props;
  return (
    <Box
      p={10}
      m={6}
      {...rest}
      textAlign="center"
      // maxW="976px"
      color={color || "black"}
      id={id}
    >
      <Heading
        as={as}
        fontSize={
          as === "h1"
            ? { base: "42px", xl: "64px" }
            : { base: "18px", xl: "24px" }
        }
        fontWeight="thin"
      >
        {heading}
      </Heading>
      {heading && <Divider my={4} />}
      {children}
    </Box>
  );
};
