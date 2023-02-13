import { Button, Image, Link, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { TextBlock } from "../components";
import { Page, Segment } from "../templates";

export const Success = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("data")));
  }, []);

  if (!data) {
    return (
      <Page>
        <Segment color="white">
          You may have reached this page in error. If you just joined and made
          it to this page, check your email for further details, or reach out to
          us at webmaster@okcastroclub.com.
        </Segment>
      </Page>
    );
  }
  const nameArr = data.name ? data.name.split(" ") : "";

  return (
    <Page>
      <Segment
        color="white"
        top={<Image src="./okcac-logo__black.png" w="350px" mt="-9" />}
        heading={
          data.name ? `Welcome, ${nameArr[0]}!` : "Welcome to the OKCAC!"
        }
        as="h1"
        fontWeight="thin"
      >
        <VStack pb={6} w="100%" spacing={6}>
          <TextBlock>
            Thank you for joining our club! A receipt has been emailed to you.
            Our membership coordinator will be in touch with you with additional
            information about your new membership.
          </TextBlock>

          <TextBlock>
            We look forward to meeting you and exploring the night sky together.
            Thank you for joining!
          </TextBlock>
          <TextBlock>
            If you have any questions in the meantime, please reach out to us at{" "}
            <Button variant="link" fontSize="md" color="white">
              <Link href="mailto:membership@okcastroclub.com">
                membership@okcastroclub.com
              </Link>
            </Button>
          </TextBlock>
        </VStack>
      </Segment>
    </Page>
  );
};
