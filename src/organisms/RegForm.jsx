import React from "react";
import { Form, FormInputField, FormSelectField } from "../molecules";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Divider,
  FormHelperText,
  HStack,
  Link,
} from "@chakra-ui/react";
import { getPrice, states } from "../assets/data";

export const RegForm = (props) => {
  const { data, loading, onChange, onSubmit } = props;
  const price = getPrice();

  return (
    <Form
      button={`Join Tonight for $${price}*`}
      loading={loading}
      name="register"
      onSubmit={onSubmit}
    >
      <Alert status="info" fontSize="xs">
        <AlertIcon />
        <AlertTitle>Test mode!</AlertTitle>
        <AlertDescription>
          Do NOT put CC info into this form. Use 4242 4242 4242 4242 to demo.
        </AlertDescription>
      </Alert>
      <FormInputField
        name="name"
        required={true}
        type="text"
        onChange={onChange}
        placeholder="Leo Spaceman"
        value={data.name}
      />
      <FormInputField
        name="email"
        required={true}
        type="email"
        value={data.email}
        onChange={onChange}
        placeholder="cosmo@example.com"
      />
      <Divider />

      <FormInputField
        name="address"
        type="text"
        value={data.address}
        onChange={onChange}
        placeholder={"A1A Beachfront Ave"}
      >
        <FormHelperText
          fontSize="xs"
          color={data.address ? "black" : "gray.400"}
        >
          Providing your address is optional and is used by the Astronomical
          League to mail quarterly issues of{" "}
          <Button
            variant="link"
            fontSize="xs"
            color={data.address ? "black" : "gray.400"}
          >
            <Link isExternal href="https://www.astroleague.org/reflector">
              The Reflector
            </Link>
          </Button>
          .
        </FormHelperText>
      </FormInputField>
      <FormInputField
        disabled={!data.address && true}
        name="city"
        onChange={onChange}
        placeholder="Oklahoma City"
        type="text"
        value={data.city}
      />
      <HStack justify="space-between" align="baseline">
        <FormSelectField
          disabled={!data.address && true}
          name="state"
          options={states}
          onChange={onChange}
          placeholder="Oklahoma"
          value={data.state}
        />
        <FormInputField
          disabled={!data.address && true}
          name="zip"
          onChange={onChange}
          type="number"
          placeholder="73013"
          value={data.zip}
        />
      </HStack>
    </Form>
  );
};
