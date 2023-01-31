import {
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FaStripe } from "react-icons/fa";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../pages/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

export const CheckoutModal = ({ member }) => {
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PK}`);
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: true });

  return (
    <Modal isOpen={isOpen}>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader textAlign="center">
          Checkout with{" "}
          <Icon as={FaStripe} h={12} w={16} color="blue.600" mb="-12px" />
        </ModalHeader>
        <ModalBody>
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
