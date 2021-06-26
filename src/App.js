import "./App.scss";
import React from "react";
import SplitPane from "react-split-pane";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  VStack,
  Box,
  ChakraProvider,
} from "@chakra-ui/react";
import { Global, css } from "@emotion/react";

function PaneSection({ title, children }) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton className="no-select">
          <Box flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{children}</AccordionPanel>
    </AccordionItem>
  );
}

function ModuleInfo() {
  return (
    <>
      <Accordion reduceMotion={true} defaultIndex={[0]} allowMultiple>
        <PaneSection title="Imports">section 1</PaneSection>
        <PaneSection title="Definitions">section 2</PaneSection>
        <PaneSection title="Type declarations">section 3</PaneSection>
        <PaneSection title="Classes">section 4</PaneSection>
        <PaneSection title="Class instances">section 5</PaneSection>
      </Accordion>
    </>
  );
}

function ModulesList() {
  return <>Main</>;
}

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

function Layout() {
  return (
    <>
      <SplitPane split="horizontal" defaultSize={100}>
        <Pane />
        <SplitPane split="horizontal" defaultSize={200} primary="second">
          <SplitPane split="vertical" defaultSize={150}>
            <Pane title="Modules">
              <ModulesList />
            </Pane>
            <SplitPane split="vertical" defaultSize={200}>
              <Pane title="Main">
                <ModuleInfo />
              </Pane>
              <Pane />
            </SplitPane>
          </SplitPane>
          <Pane />
        </SplitPane>
      </SplitPane>
    </>
  );
}

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

function App() {
  return (
    <ChakraProvider>
      <Global styles={GlobalStyles} />
      <Box w="100%" h="100vh">
        <Layout />
      </Box>
    </ChakraProvider>
  );
}

export default App;
