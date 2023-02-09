import React from "react";
import { Flex } from "@chakra-ui/react";
import { Navigation } from "../organisms";

export const Page = (props) => {
  const { children, direction, rest } = props;

  return (
    <Flex
      className="App"
      direction="column"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      bgImage="linear-gradient(rgba(44, 82, 130, 0.9),rgba(44, 82, 130, 0.5)) , url('./bg.jpg')"
      minH="100vh"
      maxW="1100px"
      margin="0 auto"
    >
      <Navigation />

      <Flex
        {...rest}
        direction={direction}
        justify="space-evenly"
        align="center"
        alignSelf="center"
      >
        {children}
      </Flex>
    </Flex>
  );
};
