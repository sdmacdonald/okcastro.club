import React from "react";
import { Flex } from "@chakra-ui/react";

export const Page = (props) => {
  const { children, rest } = props;

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify={{ base: "flex-start", md: "space-evenly" }}
      align="center"
      {...rest}
    >
      {children}
    </Flex>
  );
};
