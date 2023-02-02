import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Navigation } from "../organisms";

export const Page = (props) => {
  const { children, direction, rest } = props;

  return (
    <Box
      className="App"
      minH="100vh"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      bgImage="linear-gradient(rgba(44, 82, 130, 0.9),rgba(44, 82, 130, 0.5)) , url('./bg.jpg')"
    >
      <Navigation />

      <Flex
        direction={direction}
        justify={{ base: "flex-start", md: "space-evenly" }}
        align="center"
        pb={4}
        {...rest}
      >
        {children}
      </Flex>
    </Box>
  );
};
