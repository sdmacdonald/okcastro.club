import React from "react";
import { Text } from "@chakra-ui/react";

export const getPrice = () => {
  const months = [45, 42, 39, 36, 33, 30, 27, 24, 21, 18, 15, 12];
  let m = months[new Date().getMonth()];
  return m;
};
