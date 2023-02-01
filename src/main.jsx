import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Box, ChakraProvider, Stack } from "@chakra-ui/react";
import { LinkIcon } from "./components";
import { FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { App } from "./App";
import { Success } from "./pages/Success";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "success",
    element: <Success />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
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
        <RouterProvider router={router} />
      </Box>
    </ChakraProvider>
  </React.StrictMode>
);
