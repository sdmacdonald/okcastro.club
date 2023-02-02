import { HStack, Image, Link } from "@chakra-ui/react";
import React from "react";
import { NavButtons } from "../molecules";

export const Navigation = () => {
  return (
    <HStack
      w="100%"
      justify="space-between"
      align="center"
      bgColor="blue.800"
      borderBottom="1px"
      borderColor="gray.600"
      shadow="md"
      spacing={4}
      py={2}
    >
      <Link href="/">
        <Image src="./okcac-logo__white.png" w="125px" mx={2} />
      </Link>
      <NavButtons />
    </HStack>
  );
};
