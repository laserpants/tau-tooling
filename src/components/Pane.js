import React from "react";
import { Box, VStack } from "@chakra-ui/react";

function Pane({ title, children }) {
  return (
    <Box overflow="auto">
      <VStack align="left">
        {title && <Box>{title}</Box>}
        <Box>{children}</Box>
      </VStack>
    </Box>
  );
}

export default Pane;
