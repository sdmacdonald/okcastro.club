import React, { useState } from "react";
import { ImagingSessionForm } from "../organisms";
import { TextBlock } from "../components";
import { Page, Segment, StripeCheckout } from "../templates";
import {
  Alert,
  AlertIcon,
  Button,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const ImagingSession = () => {
  const [member, setMember] = useState({
    name: "",
    email: "",
    item: "imaging-session",
  });
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
      <Segment
        heading={`Okie-Tex PixInsight Imaging Workshop.`}
        as="h1"
        color="white"
      >
        <TextBlock>
          Add on to your Okie-Tex experience with a two day astrophotography
          processing seminar hosted by master photographer John Talbot. Now back
          for a fifth year! Also this year - special guest astrophotographer,
          YouTuber and "Galactic Hunter" Antoine Grelin will be closing out the
          Monday session.
        </TextBlock>
        <TextBlock>
          The imaging session will be Sunday, September 10 and Monday, September
          11. The sessions start at 10am central time at the Kenton Senior
          Center, and will last until 4:30pm, with a lunch break.
        </TextBlock>

        <VStack>
          <Heading as="h2" size="md">
            Day One: Fun with Exterminators using Narrowband and RGB
          </Heading>
          <TextBlock>
            John will demo Starnet++ and Russ Chroma's exterminators to enhance
            their images. Sometimes you need to get rid of the stars first
            before you combine narrowband with RGB. Maybe you want to add RGB
            stars to a false color image. John will also show how to use the new
            Generalized Hyperbolic Stretch routine, which is part of PixInsight,
            as part of the tutorial and briefly cover the new updates to PI that
            have come out over the last year.
          </TextBlock>
        </VStack>

        <VStack>
          <Heading as="h2" size="md">
            Day Two: Using Hydrogen Alpha Data as a Background
          </Heading>
          <TextBlock>
            Antoine Grelin takes over in the second half of day two will be
            showing off his techniques that allowed him to get images such as
            <Text textDecoration={"underline"}>
              <Link to="https://www.astrobin.com/fitgcc/0/">
                this striking Double Cluster.
              </Link>
            </Text>
          </TextBlock>
        </VStack>

        <TextBlock>
          Each seat is $100 per person. You must be registered for the Okie-Tex
          Star Party to attend.
        </TextBlock>
      </Segment>

      <Segment
        rest={{
          bgColor: "white",
          borderRadius: { base: "none", md: "md" },
          shadow: "md",
        }}
        mx={3}
        heading="Reserve your seat - $100 per person."
        as="h2"
      >
        <ImagingSessionForm
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
