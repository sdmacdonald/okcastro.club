import React, { useState } from "react";
import { Form } from "../templates/Form";
import { CheckoutModal, FormInputField, FormSelectField } from "../components";
import { registrationInitialValues, states } from "../data";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getPrice } from "../components/getPrice";

export const Register = () => {
  const [member, setMember] = useState(registrationInitialValues);
  const price = getPrice();

  const handleChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/.netlify/functions/create-payment-intent`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setMember((prevMember) => ({ ...prevMember, pi: data.clientSecret }));
        console.log(data);
        localStorage.setItem("data", JSON.stringify(member));
      })
      .then((error) => console.error(error));
  };

  return (
    <>
      {member.pi && <CheckoutModal member={member} />}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={{ base: "flex-start", md: "space-evenly" }}
        align="center"
      >
        <Stack
          maxW="md"
          w="100%"
          mt="-20px"
          p={12}
          color="white"
          spacing={8}
          justify="center"
          textAlign="center"
        >
          <Image src="./okcac-logo__white.png" w="350px" />
          <Heading fontWeight="thin" fontSize="42px">
            Explore the Night Sky with Us.
          </Heading>
          <Divider />
          <Text lineHeight="taller">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere
            nesciunt aut veritatis impedit doloremque optio voluptatibus autem
            nemo obcaecati voluptate voluptatem qui, provident laudantium
            quisquam ad reiciendis assumenda non minus.
          </Text>
        </Stack>

        <Stack
          maxW="lg"
          w="100%"
          p={12}
          shadow="sm"
          borderRadius="md"
          bgColor="white"
        >
          <Form
            name="register"
            button={`Join Tonight for $${price}*`}
            onSubmit={handleSubmit}
          >
            <FormInputField
              name="name"
              type="text"
              value={member.name}
              onChange={handleChange}
              placeholder="Leo Spaceman"
            />
            <FormInputField
              name="email"
              type="email"
              value={member.email}
              onChange={handleChange}
              placeholder="cosmo@example.com"
            />
            <Divider />

            <FormInputField
              name="address"
              type="text"
              value={member.address}
              onChange={handleChange}
              placeholder={"A1A Beachfront Ave"}
            >
              <FormHelperText fontSize="sm" color="gray.400">
                Providing your address is optional and is used by the
                Astronomical League to mail quarterly issues of{" "}
                <Button variant="link" fontSize="sm" color="gray.400">
                  The Reflector
                </Button>
              </FormHelperText>
            </FormInputField>
            <FormInputField
              name="city"
              type="text"
              value={member.city}
              onChange={handleChange}
              placeholder="Oklahoma City"
            />
            <HStack justify="space-between">
              <FormSelectField
                name="state"
                placeholder="Oklahoma"
                options={states}
                onChange={handleChange}
                value={member.state}
              />
              <FormInputField
                name="zip"
                type="number"
                value={member.zip}
                onChange={handleChange}
                placeholder="73013"
              />
            </HStack>
          </Form>
        </Stack>
      </Flex>
    </>
  );
};
