import React, { useEffect } from "react";
import {
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Accordion } from "../components";
import { CheckoutForm } from "./organisms";
import { FaStripe } from "react-icons/fa";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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
