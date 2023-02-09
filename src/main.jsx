import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App";
import { Success } from "./pages/Success";
import { Observing } from "./pages/Observing";
import { Gazette } from "./pages/Gazette";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "success",
    element: <Success />,
  },
  {
    path: "observing",
    element: <Observing />,
  },
  {
    path: "gazette",
    element: <Gazette />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
