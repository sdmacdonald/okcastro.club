import {
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  HStack,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FaStripe } from "react-icons/fa";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../pages/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Accordion } from "../components";

export const CheckoutModal = ({ data }) => {
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PK}`);
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: true });

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  return (
    <Modal isOpen={isOpen}>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader textAlign="center">
          Checkout with{" "}
          <Icon as={FaStripe} h={12} w={16} color="blue.600" mb="-12px" />
        </ModalHeader>
        <ModalBody>
          <Accordion heading="Order Summary" amount={data.amount}>
            <Flex
              justify="space-between"
              align="baseline"
              textTransform="uppercase"
            >
              {data.name}
              <span />
              {data.item}
            </Flex>
          </Accordion>
          <Elements options={{ clientSecret: data.pi }} stripe={stripePromise}>
            <CheckoutForm member={data} />
          </Elements>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
