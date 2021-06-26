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
  Link,
  Table,
  Text,
  Th,
  Tr,
  Td,
  Tbody,
  Tfoot,
  Thead,
  ChakraProvider,
} from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { AiFillFolder } from "react-icons/ai";
import {
  TreeMenuContainer,
  TreeMenu,
  TreeMenuItem,
} from "./components/TreeMenu";

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

function ModulePane() {
  const TableCell = ({ children }) => (
    <Td borderTop="1px solid #e2e8f0" borderBottom="none" py={1}>
      {children}
    </Td>
  );

  const TableRow = ({ children }) => {
    return (
      <Tr cursor="pointer" _hover={{ background: "rgba(0, 0, 0, 0.04)" }}>
        {React.Children.toArray(children).map((child, i) => (
          <React.Fragment key={i}>{child}</React.Fragment>
        ))}
      </Tr>
    );
  };

  return (
    <>
      <Accordion reduceMotion={true} defaultIndex={[0]} allowMultiple>
        <PaneSection title="Imports">section 1</PaneSection>
        <PaneSection title="Definitions">
          <Table size="sm">
            <Tbody>
              <TableRow>
                <TableCell>main</TableCell>
                <TableCell>Int &rarr; IO ()</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>toString</TableCell>
                <TableCell>a &rarr; String</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>factorial</TableCell>
                <TableCell>Nat &rarr; Nat</TableCell>
              </TableRow>
            </Tbody>
          </Table>
        </PaneSection>
        <PaneSection title="Type declarations">
          <Table size="sm">
            <Tbody>
              <TableRow>
                <TableCell>List a</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nat</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Option a</TableCell>
              </TableRow>
            </Tbody>
          </Table>
        </PaneSection>
        <PaneSection title="Classes">section 4</PaneSection>
        <PaneSection title="Class instances">section 5</PaneSection>
      </Accordion>
    </>
  );
}

function ModulesList() {
  return (
    <TreeMenuContainer>
      <TreeMenu>
        <TreeMenuItem root title="Main" />
        <TreeMenuItem root title="List" />
        <TreeMenuItem root icon={AiFillFolder} title="List">
          <TreeMenu>
            <TreeMenuItem title="List.Extra" />
            <TreeMenuItem title="List.NonEmpty" />
          </TreeMenu>
        </TreeMenuItem>
      </TreeMenu>
    </TreeMenuContainer>
  );
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
      <SplitPane split="horizontal" defaultSize={20}>
        <Pane />
        <SplitPane split="horizontal" defaultSize={200} primary="second">
          <SplitPane split="vertical" defaultSize={150}>
            <Pane title="Modules">
              <ModulesList />
            </Pane>
            <SplitPane split="vertical" defaultSize={200}>
              <Pane title="Main">
                <ModulePane />
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
