import "./App.scss";
import React, { useState, useContext } from "react";
import axios from "./axios";
import ExprPipeline from "./components/ExprPipeline";
import Pane from "./components/Pane";
import PaneSection from "./components/PaneSection";
import SplitPane from "react-split-pane";
import {
  Accordion,
  Box,
  Button,
  Table,
  VStack,
  Tr,
  Td,
  Textarea,
  Tbody,
  ChakraProvider,
} from "@chakra-ui/react";
//import bundle from "./tmp/bundle";
import { AiFillTag } from "react-icons/ai";
import { AppContext, AppContextProvider } from "./contexts/App";
import { Global, css } from "@emotion/react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { TreeMenuContainer } from "./components/TreeMenu";

function ModulePane() {
  const TableCell = ({ children }) => (
    <Td borderTop="1px solid #e2e8f0" borderBottom="none" py={2} px={3}>
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
              <TableCell>
                <Box mr={1}>
                  <AiFillTag />
                </Box>
                List a
              </TableCell>
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
  //const testTree = [
  //  {
  //    nodeName: "Main",
  //    children: [],
  //  },
  //  {
  //    nodeName: "List",
  //    children: [],
  //  },
  //  {
  //    nodeName: "List",
  //    expandedIcon: AiFillFolder,
  //    collapsedIcon: AiFillFolder,
  //    expanded: true,
  //    children: [
  //      {
  //        nodeName: "List.Extra",
  //        children: [],
  //      },
  //      {
  //        nodeName: "List.NonEmpty",
  //        children: [],
  //      },
  //    ],
  //  },
  //];

  //const { treeNodes, handleNodeToggled } = useMenu(testTree);

  return (
    <TreeMenuContainer>
      {/*
      <Tree nodes={treeNodes} onToggleNode={handleNodeToggled} />
      */}
    </TreeMenuContainer>
  );
}

function Layout() { // eslint-disable-line no-unused-vars
  return (
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
              {/*
              <ExprPipeline bundle={bundle} />
              */}
            </Pane>
          </SplitPane>
        </SplitPane>
        <Pane>xx</Pane>
      </SplitPane>
    </SplitPane>
  );
}

function Layout2() {
  const [source, setSource] = useState("");
  const { setBundle } = useContext(AppContext);
  //const [bundle, setBundle] = useState();

  const handleClick = async () => {
    const res = await axios.post("/run", { source });
    try {
      const bundle = JSON.parse(res.data.bundle);
      setBundle(bundle);
      console.log(bundle);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
            <Textarea
              fontFamily="monospace"
              onChange={(e) => {
                setSource(e.target.value);
              }}
              value={source}
            />
            <Button onClick={handleClick}>asfdadsf</Button>

      <div><ExprPipeline /></div>
    </>
  );
//    <SplitPane split="horizontal" defaultSize={300}>
//      <SplitPane split="vertical" defaultSize={600}>
//        <Pane>
//          <VStack>
//            <Textarea
//              fontFamily="monospace"
//              onChange={(e) => {
//                setSource(e.target.value);
//              }}
//              value={source}
//            />
//            <Button onClick={handleClick}>asfdadsf</Button>
//          </VStack>
//        </Pane>
//        <Pane>
//          {/*
//          {bundle && (
//            <ExprPipeline bundle={bundle} />
//          )}
//          */}
//        </Pane>
//      </SplitPane>
//      {/*
//      <div>{bundle && <ExprPipeline bundle={bundle} />}</div>
//      */}
//      <div><ExprPipeline /></div>
//      {/*
//      <ExprPipeline bundle={bundle} />
//      */}
//    </SplitPane>
//  );
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
      <AppContextProvider>
        <Box w="100%" h="100vh">
          <Layout2 />
        </Box>
      </AppContextProvider>
    </ChakraProvider>
  );
}

export default App;
