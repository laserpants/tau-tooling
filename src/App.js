import "./App.scss";
import Pane from "./components/Pane";
import PaneSection from "./components/PaneSection";
import React from "react";
import SplitPane from "react-split-pane";
import {
  Accordion,
  Box,
  Table,
  Tr,
  Td,
  Tbody,
  ChakraProvider,
} from "@chakra-ui/react";
import { AiFillFolder } from "react-icons/ai";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { Global, css } from "@emotion/react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import {
  TreeMenuContainer,
  TreeMenu,
  TreeMenuItem,
} from "./components/TreeMenu";

function ModulePane() {
  const TableCell = ({ children }) => (
    <Td borderTop="1px solid #e2e8f0" borderBottom="none" py={1} px={3}>
      <Box d="flex" alignItems="center">
        {children}
      </Box>
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
    <Accordion reduceMotion={true} defaultIndex={[0]} allowMultiple>
      <PaneSection title="Imports">section 1</PaneSection>
      <PaneSection title="Definitions">
        <Table size="sm">
          <Tbody>
            <TableRow>
              <TableCell>
                <Box mr={1}>
                  <IoIosArrowDroprightCircle />
                </Box>
                main
              </TableCell>
              <TableCell>Int &rarr; IO ()</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box mr={1}>
                  <IoIosArrowDroprightCircle />
                </Box>
                toString
              </TableCell>
              <TableCell>a &rarr; String</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box mr={1}>
                  <IoIosArrowDroprightCircle />
                </Box>
                factorial
              </TableCell>
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

function Layout() {
  const testTree = [
    {
      nodeName: "EFix",
      expanded: false,
      children: [
        {
          nodeName: "ELam",
          children: [],
        },
        {
          nodeName: "ELet",
          children: [],
        },
      ],
    },
  ];

  const Tree = ({ nodes, root = false }) => {
    return (
      nodes && (
        <TreeMenu>
          {nodes.map(({ nodeName, children }, i) => (
            <TreeMenuItem root={root} key={i} title={nodeName}>
              <Tree nodes={children} />
            </TreeMenuItem>
          ))}
        </TreeMenu>
      )
    );
  };

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
              <Pane title="Main.factorial">
                <TreeMenuContainer>
                  <Tree nodes={testTree} root={true} />
                  {/*
                  <TreeMenu>
                    <TreeMenuItem root title="Root">
                      <TreeMenu>
                        <TreeMenuItem title="Main" />
                        <TreeMenuItem title="List" />
                        <TreeMenuItem icon={FaPlusSquare} title="List">
                          <TreeMenu>
                            <TreeMenuItem title="List.Extra" />
                            <TreeMenuItem title="List.NonEmpty" />
                          </TreeMenu>
                        </TreeMenuItem>
                      </TreeMenu>
                    </TreeMenuItem>
                  </TreeMenu>
                  */}
                </TreeMenuContainer>
              </Pane>
            </SplitPane>
          </SplitPane>
          <Pane>xx</Pane>
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
