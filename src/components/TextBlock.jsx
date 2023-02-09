import { Box, Text } from "@chakra-ui/react";
import React from "react";

export const TextBlock = (props) => {
  const { children, color, textAlign } = props;
  return (
    <Box
      color={color}
      textAlign={textAlign || "center"}
      fontSize={{ base: "md", xl: "xl" }}
    >
      <Text lineHeight="taller" display="block" my={2}>
        {children}
      </Text>
    </Box>
  );
};
