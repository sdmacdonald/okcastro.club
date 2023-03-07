import React from "react";
import { Form, FormInputField } from "../molecules";
import { Link } from "@chakra-ui/react";

export const ImagingSessionForm = (props) => {
  const { member, loading, onChange, onSubmit } = props;

  return (
    <Form
      button={`Sign Up`}
      loading={loading}
      name="imaging-session"
      onSubmit={onSubmit}
      helperText={`You must be an Okie-Tex 2023 registrant to join this class. If you haven't registered, please do so at ${(
        <Link href="http://www.okie-tex.com">okie-tex.com</Link>
      )}`}
    >
      <FormInputField
        name="name"
        required={true}
        type="text"
        onChange={onChange}
        placeholder="Mike Dennis"
        value={member.name}
      />
      <FormInputField
        name="email"
        required={true}
        type="email"
        value={member.email}
        onChange={onChange}
        placeholder="darkFrames@spacepix.com"
      />
    </Form>
  );
};