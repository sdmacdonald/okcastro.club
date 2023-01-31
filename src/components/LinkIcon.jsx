import React from "react";
import { Box, Icon, Link } from "@chakra-ui/react";

export const LinkIcon = ({ color, height, icon, isExternal, link, width }) => {
  return (
    <Link href={link || ""} isExternal={false || isExternal}>
      <Box>
        <Icon
          as={icon}
          h={height || 6}
          w={width || 6}
          color={color || "whiteAlpha.600"}
        />
      </Box>
    </Link>
  );
};
