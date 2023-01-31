import React from "react";
import { Form, FormInputField, FormSelectField } from "../molecules";
import { Button, Divider, FormHelperText, HStack } from "@chakra-ui/react";
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
            The Reflector
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
