import React from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";

function PaneSection({ title, children }) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton className="no-select" px={2}>
          <AccordionIcon mr={1} fontSize="15px" />
          <Box flex="1" textAlign="left">
            <Text fontSize="14px">{title}</Text>
          </Box>
        </AccordionButton>
      </h2>
      <AccordionPanel py={0} px={0}>
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default PaneSection;
