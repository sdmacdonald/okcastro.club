import React from "react";
import { Stack } from "@chakra-ui/react";
import { LinkIcon } from "../components";
import { FiMail } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";

export const NavButtons = () => {
  return (
    <Stack direction="row" align="baseline" justify="end" spacing={6} p={4}>
      <LinkIcon link={import.meta.env.VITE_CONTACT} icon={FiMail} isExternal />
      <LinkIcon
        link="https://github.com/sdmacdonald/okcastro.club"
        icon={FaGithub}
        isExternal
      />
    </Stack>
  );
};
