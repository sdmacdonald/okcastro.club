import React, { useState } from "react";
import { Form } from "../templates/Form";
import { FormInputField, FormSelectField } from "../components";
import { registrationInitialValues, states } from "../data";
import { Box } from "@chakra-ui/react";

export const Register = () => {
  const [member, setMember] = useState(registrationInitialValues);

  const handleChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });

  return (
    <Box
      bgColor="white"
      minW="370px"
      maxW="540px"
      borderRadius="md"
      shadow="md"
    >
      <Form name="register" button="Register">
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
        <FormInputField
          name="address"
          type="text"
          value={member.address}
          onChange={handleChange}
          placeholder={"A1A Beachfront Ave"}
        />
        <FormInputField
          name="city"
          type="text"
          value={member.city}
          onChange={handleChange}
          placeholder={"Oklahoma City"}
        />
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
      </Form>
    </Box>
  );
};
