import React, { useState } from "react";
import { registrationInitialValues } from "../assets/data";
import { RegForm } from "../organisms";
import { TextBlock } from "../components";
import { Page, Segment, StripeCheckout } from "../templates";
import { Alert, AlertIcon, Button, useDisclosure } from "@chakra-ui/react";

export const Register = () => {
  const [member, setMember] = useState(registrationInitialValues);
  const [loading, isLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    isLoading(true);

    const url = `${
      import.meta.env.VITE_BASE_URL
    }/.netlify/functions/create-payment-intent`;

    const method = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    };

    const res = await fetch(url, method);

    if (!res.ok) throw Error(res.message);

    try {
      const data = await res.json();
      setMember((prevMember) => ({
        ...prevMember,
        name: data.metadata.name,
        email: data.metadata.email,
        customer: data.metadata.name,
        pi: data.clientSecret,
        amount: data.metadata.amount,
      }));
      isLoading(false);
      onOpen(!isOpen);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page>
      {member.pi && (
        <StripeCheckout member={member} onClose={onClose} isOpen={isOpen} />
      )}
      <Segment heading={`Explore the Night Sky with Us.`} as="h1" color="white">
        <TextBlock>
          The Oklahoma City Astronomy Club has been helping metro area residents
          observe the wonders and mysteries of our night sky since 1958. We use
          telescopes, binoculars, cameras and our own eyes to observe and deepen
          our understanding of the universe.
        </TextBlock>
      </Segment>

      <Segment
        rest={{
          bgColor: "white",
          borderRadius: { base: "none", md: "md" },
          shadow: "md",
        }}
        mx={3}
        heading="New Member Registration"
        as="h2"
      >
        <RegForm
          member={member}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        <Alert status="warning" variant="top-accent" mt={12} fontSize="xs">
          <AlertIcon />
          Problems with this form? Let us know:
          <Button
            variant="link"
            href="mailto:webmaster@okcastroclub.com"
            size="xs"
            mx={1}
          >
            webmaster@okcastroclub.com
          </Button>
        </Alert>
      </Segment>
    </Page>
  );
};
