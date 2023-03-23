import { Box, Text } from "@chakra-ui/react";
import React from "react";

export const TextBlock = (props) => {
  const { children, color, textAlign } = props;
  return (
    <Box
      color={color}
      textAlign={textAlign || "center"}
      fontSize={{ base: "sm", xl: "md" }}
    >
      <Text lineHeight="taller" display="block" mx={12} my={4}>
        {children}
      </Text>
    </Box>
  );
};
