import React, { useState } from "react";
import { ImagingSessionForm } from "../organisms";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Page, Segment, StripeCheckout } from "../templates";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { TextBlock } from "../components";

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
        heading={`Okie-Tex Beginner's PixInsight Imaging Workshop.`}
        as="h1"
        color="white"
      >
        <TextBlock>
          Add on to your Okie-Tex experience with a two day astrophotography
          processing seminar hosted by master photographer Jon Talbot. Now back
          for a sixth year!
        </TextBlock>
        <TextBlock>
          A more "beginner" session has been much requested, and Jon is ready to
          oblige! This year, learn the ins and outs of PixInsight from the true
          amateur perspective.
        </TextBlock>
        <TextBlock>
          Learn how to process an image in PixInsight. Jon will teach attendees
          how to take a stack of raw image data and turn it into a beautiful,
          professional level astrophoto. Learn tips on acquiring better data for
          your photos, and learn how to master PixInsight with a guided
          tutorial, filled with tips, tricks and best practices for getting the
          most out of your data and PixInsight.
        </TextBlock>
        <TextBlock>
          The imaging session will be Sunday, September 29 and Monday, September
          30. The sessions start at 10am central time at the Kenton Senior
          Center, and will last until 4:30pm, with a lunch break.
        </TextBlock>
      </Segment>

      <Segment
        rest={{
          bgColor: "white",
          borderRadius: { base: "sm", md: "md" },
          shadow: "md",
        }}
        mx={3}
        heading="Reserve your seat."
        as="h2"
      >
        <Text my={4}>
          Each seat is $100 per person. You must be registered for the Okie-Tex
          Star Party to attend.
        </Text>
        <ImagingSessionForm
          member={member}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        {/* <Alert status="warning" variant="top-accent" mt={12} fontSize="xs">
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
        </Alert> */}
      </Segment>
      <Segment heading={`About Jon Talbot.`} as="h2" color="white">
        <TextBlock>
          Jon Talbot, formerly a Flight Meteorologist with the Air Force
          Reserve's "Hurricane Hunters" at Keesler AFB, MS, contributed crucial
          data to the National Hurricane Center over 34 years, navigating
          through more than 150 Hurricanes and Tropical Cyclones.
        </TextBlock>
        <TextBlock>
          In retirement, his focus has shifted to astronomical imaging, a field
          he entered in 1999 after acquiring a Meade 4" reflector telescope. His
          engagement with astronomy deepened after upgrading his equipment and
          constructing an observatory to house a computerized Meade 8"LX200 and
          his first CCD camera in 2002. Now, Talbot employs advanced gear
          including a Software Bisque Paramount MYT mount, Stellarvue
          refractors, and a custom-made carbon fiber Newtonian astrograph for
          his astrophotography.
        </TextBlock>
        <TextBlock>
          The challenge and satisfaction of capturing celestial images have been
          a significant and rewarding part of his post-military life. Talbot is
          a familiar face at the Okie-Tex Star Party, where his contributions
          and experiences enrich the event. He has also been a keynote speaker
          at the Texas Star Party, sharing his expertise and inspiring the
          amateur astronomer community.
        </TextBlock>
        <TextBlock>
          Read more about Jon, and see some of his incredible astroimages at{" "}
          <Link href="http://starscapeimaging.com/" isExternal>
            his website <ExternalLinkIcon mx="2px" />.
          </Link>
        </TextBlock>
      </Segment>
    </Page>
  );
};
