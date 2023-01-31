import { Box, Icon, Link, Stack } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import React from "react";

import { Register } from "./pages/Register";
import { LinkIcon } from "./components/LinkIcon";

export const App = () => {
  return (
    <Box
      className="App"
      minH="100vh"
      bgPosition="center"
      bgSize="cover"
      bgImage="linear-gradient(rgba(44, 82, 130, 0.9),rgba(44, 82, 130, 0.5)) , url('./bg.jpg')"
    >
      <Stack direction="row" align="baseline" justify="end" spacing={6} p={4}>
        <LinkIcon link="" icon={FiMail} isExternal />
        <LinkIcon
          link="https://github.com/sdmacdonald/okcastro.club"
          icon={FaGithub}
          isExternal
        />
      </Stack>
      <Register />
    </Box>
  );
};
