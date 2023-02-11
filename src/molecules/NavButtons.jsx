import React from "react";
import { Stack } from "@chakra-ui/react";
import { LinkIcon } from "../components";
import { FiMail } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { GoTelescope } from "react-icons/go";

export const NavButtons = () => {
  return (
    <Stack
      direction="row"
      align="center"
      justify="end"
      spacing={6}
      px={4}
      pt="1"
    >
      <LinkIcon link="observing" icon={GoTelescope} />
      <LinkIcon link={`mailto:${import.meta.env.VITE_CONTACT}`} icon={FiMail} />
      <LinkIcon
        link="https://github.com/sdmacdonald/okcastro.club"
        icon={FaGithub}
        isExternal
      />
    </Stack>
  );
};
