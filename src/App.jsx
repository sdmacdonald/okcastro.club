import { Box } from "@chakra-ui/react";
import React from "react";

import { Register } from "./pages/Register";

export const App = () => {
  return (
    <Box className="App" bgColor="blue.800" minH="100vh">
      <Register />
    </Box>
  );
};
