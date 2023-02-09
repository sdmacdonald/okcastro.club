import { Box, Divider, Heading, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { Page } from "../templates";

export const Gazette = () => {
  return (
    <Page>
      <VStack maxW="lg" color="white" spacing={12}>
        <Box id="gazette__logo">
          <Image src="okcac-logo__white.png" h="175px" />
          <Divider />
        </Box>
        <Box id="gazette__intro">
          <Text>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae
            temporibus iure quam. Ex distinctio laboriosam praesentium. Minus
            hic at laboriosam dolor! Earum sint, quod accusamus consequuntur
            veniam adipisci nostrum optio.
          </Text>
          <Box
            id="gazette__presidents-message"
            display="block"
            w="100%"
            bgColor="gray.300"
            borderRadius="md"
            shadow="sm"
            h="450px"
          />
        </Box>
        <Box id="gazette__meeting">
          <Heading as="h2">February Club Meeting</Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
            explicabo cum qui accusamus dolores blanditiis optio aliquid! Cumque
            repellendus odit quaerat, labore similique doloremque voluptatum rem
            error maxime neque porro!
          </Text>
        </Box>
        <Box id="gazette__club-news"></Box>
        <Box id="gazette__space-events"></Box>
        <Box id="gazette__observing"></Box>
        <Box id="gazette_special"></Box>
        <Box id="gazette_footer"></Box>
      </VStack>
    </Page>
  );
};
