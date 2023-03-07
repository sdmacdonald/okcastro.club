import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Navigation } from "../organisms";

export const Page = (props) => {
  const { children } = props;

  return (
    <Box
      className="App"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      bgImage="linear-gradient(rgba(44, 82, 130, 0.9),rgba(44, 82, 130, 0.5)) , url('./bg.jpg')"
      minH="100vh"
      pb="8"
      maxW="100%"
    >
      <Navigation />
      <Stack justify="center" align="center" wrap="wrap" spacing="8">
        {children}
      </Stack>
    </Box>
  );
};
