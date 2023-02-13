import React, { useEffect } from "react";
import {
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import { Accordion } from "../components";
import { CheckoutForm } from "../organisms";
import { FaStripe } from "react-icons/fa";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export const StripeCheckout = ({ member, isOpen, onClose }) => {
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PK}`);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader textAlign="center">
          Checkout with{" "}
          <Icon as={FaStripe} h={12} w={16} color="blue.600" mb="-12px" />
        </ModalHeader>
        <ModalBody>
          <Accordion heading="Order Summary" amount={member.amount}>
            <Flex
              justify="space-between"
              align="baseline"
              textTransform="uppercase"
            >
              {member.name}
              <span />
              {member.item}
            </Flex>
          </Accordion>
          <Elements
            options={{ clientSecret: member.pi }}
            stripe={stripePromise}
          >
            <CheckoutForm member={member} />
          </Elements>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
