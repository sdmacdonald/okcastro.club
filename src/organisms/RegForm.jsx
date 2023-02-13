import React from "react";
import { Form, FormInputField, FormSelectField } from "../molecules";
import {
  Button,
  Divider,
  FormHelperText,
  HStack,
  Link,
} from "@chakra-ui/react";
import { getPrice, states } from "../assets/data";

export const RegForm = (props) => {
  const { member, loading, onChange, onSubmit } = props;
  const price = getPrice();

  return (
    <Form
      button={`Join Tonight for $${price}`}
      loading={loading}
      name="register"
      onSubmit={onSubmit}
    >
      <FormInputField
        name="name"
        required={true}
        type="text"
        onChange={onChange}
        placeholder="Leo Spaceman"
        value={member.name}
      />
      <FormInputField
        name="email"
        required={true}
        type="email"
        value={member.email}
        onChange={onChange}
        placeholder="cosmo@example.com"
      />
      <Divider />

      <FormInputField
        name="address"
        type="text"
        value={member.address}
        onChange={onChange}
        placeholder={"A1A Beachfront Ave"}
      >
        <FormHelperText
          fontSize="xs"
          color={member.address ? "black" : "gray.400"}
        >
          Providing your address is optional and is used by the Astronomical
          League to mail quarterly issues of{" "}
          <Button
            variant="link"
            fontSize="xs"
            color={member.address ? "black" : "gray.400"}
          >
            <Link isExternal href="https://www.astroleague.org/reflector">
              The Reflector
            </Link>
          </Button>
          .
        </FormHelperText>
      </FormInputField>
      <FormInputField
        disabled={!member.address && true}
        name="city"
        onChange={onChange}
        placeholder="Oklahoma City"
        type="text"
        value={member.city}
      />
      <HStack justify="space-between" align="baseline">
        <FormSelectField
          disabled={!member.address && true}
          name="state"
          options={states}
          onChange={onChange}
          placeholder="Oklahoma"
          value={member.state}
        />
        <FormInputField
          disabled={!member.address && true}
          name="zip"
          onChange={onChange}
          type="number"
          placeholder="73013"
          value={member.zip}
        />
      </HStack>
    </Form>
  );
};
