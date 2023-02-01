import React from "react";
import { Flex } from "@chakra-ui/react";

export const Page = (props) => {
  const { children, rest } = props;

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justify={{ base: "flex-start", md: "space-evenly" }}
      align="center"
      pb={12}
      {...rest}
    >
      {children}
    </Flex>
  );
};
