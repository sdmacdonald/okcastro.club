import {
  Accordion as Acc,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";

export const Accordion = (props) => {
  const { amount, children, heading } = props;
  return (
    <Acc allowToggle my={6} bgColor="gray.100">
      <AccordionItem>
        <AccordionButton
          fontSize="xs"
          textTransform="uppercase"
          fontWeight="bold"
        >
          <Box as="span" flex="1" textAlign="left">
            {heading}
          </Box>
          {amount && <Flex alignSelf="end">${amount / 100}</Flex>}

          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4} fontSize="xs">
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Acc>
  );
};
