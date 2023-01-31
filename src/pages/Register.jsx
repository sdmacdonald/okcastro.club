import React, { useEffect, useState } from "react";
import { registrationInitialValues } from "../data";
import { Divider, Image, Text } from "@chakra-ui/react";
import { Page, Segment } from "../templates";
import { CheckoutModal } from "../organisms";
import { RegForm } from "../organisms";
import { TextBlock } from "../components";

export const Register = () => {
  const [member, setMember] = useState(registrationInitialValues);
  const [loading, isLoading] = useState(false);

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
        pi: data.clientSecret,
        amount: data.metadata.amount,
      }));
      isLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page>
      {member.pi && <CheckoutModal data={member} />}
      <Segment
        rest={{
          color: "white",
          mt: "-20px",
          spacing: 8,
          justify: "center",
          textAlign: "center",
        }}
        top={
          <Image src="./okcac-logo__white.png" w="350px" alignSelf="center" />
        }
        heading="Explore the Night Sky with Us."
        as="h1"
        fontSize="48px"
        fontWeight="thin"
      >
        <Divider />
        <TextBlock>
          The Oklahoma City Astronomy Club has been helping metro area residents
          observe the mysteries that our night sky has to offer since 1958. We
          use telescopes, binoculars, cameras and our own two eyes to observe
          and deepen our understanding of our universe.
        </TextBlock>
      </Segment>

      <Segment rest={{ bgColor: "white", shadow: "md", borderRadius: "md" }}>
        <RegForm
          data={member}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Segment>
    </Page>
  );
};
