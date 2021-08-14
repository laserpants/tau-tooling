import "./App.scss";
import "react-reflex/styles.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "./axios";
import treeWorker from "./worker.js";
import {
  Accordion,
  Box,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  Table,
  VStack,
  Tr,
  Td,
  Textarea,
  Tbody,
  ChakraProvider,
  Spinner,
} from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { Tree } from "./components/TreeMenu";

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

function ExprTree({ tree }) {
  const [compiledTree, setCompiledTree] = useState();
  const [working, setWorking] = useState(false);
  const [map, setMap] = useState();

  const toggle = (path) => {
    setMap({
      ...map,
      [path]: !map[path],
    });
  };

  const setAllExpanded = (val) => {
    let newMap = {};
    Object.keys(map).forEach((key) => {
      newMap[key] = val;
    });
    setMap(newMap);
  };

  useEffect(() => {
    const worker = new Worker(treeWorker);

    worker.onmessage = ({ data }) => {
      switch (data.type) {
        case "ON_BEGIN":
          setWorking(true);
          break;
        case "ON_SUCCESS":
          const { tree, map } = data.payload;
          setCompiledTree(tree);
          setMap(map);
          setWorking(false);
          break;
        default:
          break;
      }
    };
    worker.postMessage(tree);
  }, [tree, setCompiledTree, setMap]);

  return (
    <>
      {working ? (
        <Spinner />
      ) : (
        <>
          <button
            onClick={() => {
              setAllExpanded(true);
            }}
          >
            expand all
          </button>
          <button
            onClick={() => {
              setAllExpanded(false);
            }}
          >
            collapse all
          </button>
          {/*
          <Stack direction="row" mb={2}>
            <ButtonGroup variant="outline" size="xs" spacing="1">
              <Button borderRadius={0}>New</Button>
              <IconButton onClick={collapseAll} icon={<BiCollapse />} />
              <IconButton onClick={expandAll} icon={<BiExpand />} />
            </ButtonGroup>
          </Stack>
          */}
          {compiledTree && (
            <Tree 
              nodes={[compiledTree]} 
              map={map} 
              toggle={toggle} 
            />
          )}
        </>
      )}
    </>
  );
}

function App() {
  const [source, setSource] = useState("");
  const [sourceTree, setSourceTree] = useState(null);
  const [typedTree, setTypedTree] = useState(null);
  const [normalTree, setNormalTree] = useState(null);
  const [stage1Tree, setStage1Tree] = useState(null);
  const [stage2Tree, setStage2Tree] = useState(null);
  const [stage3Tree, setStage3Tree] = useState(null);
  const [stage4Tree, setStage4Tree] = useState(null);
  const [coreExpr, setCoreExpr] = useState(null);
  const [context, setContext] = useState(null);
  const [value, setValue] = useState(null);
  const [logOutput, setLogOutput] = useState("");

  const log = (str) => {
    setLogOutput(logOutput.concat(str));
  };

  const handleRun = async () => {
    const res = await axios.post("/run", { source });
    try {
      const bundle = JSON.parse(res.data.bundle);
      log(bundle.source.toStr);
      setSourceTree(bundle.source);
      setTypedTree(bundle.typed);
      setContext(bundle.context);
      setNormalTree(bundle.normal);
      setStage1Tree(bundle.stage1);
      setStage2Tree(bundle.stage2);
      setStage3Tree(bundle.stage3);
      setStage4Tree(bundle.stage4);
      setCoreExpr(bundle.core);
      setValue(bundle.value);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ChakraProvider>
      <Global styles={GlobalStyles} />
      <Box w="100%" h="100vh">
        <ReflexContainer orientation="horizontal">
          <ReflexElement>
            <div className="pane-content">
              <Textarea
                fontFamily="monospace"
                minHeight={200}
                onChange={(e) => {
                  setSource(e.target.value);
                }}
                value={source}
              />
              <Button onClick={handleRun}>Run</Button>
            </div>
          </ReflexElement>
          <ReflexSplitter style={{ height: '8px' }} />
          <ReflexElement>
            <div className="pane-content">
              <Tabs size="sm" width="100%" height="100%">
                <TabList>
                  <Tab>Source tree</Tab>
                  <Tab>Typed tree</Tab>
                  <Tab>Context</Tab>
                  <Tab>Normal tree</Tab>
                  <Tab>S1</Tab>
                  <Tab>S2</Tab>
                  <Tab>S3</Tab>
                  <Tab>S4</Tab>
                  <Tab>Core</Tab>
                  <Tab>Evaluated</Tab>
                </TabList>
                <TabPanels h="100%" overflow="auto" className="tree-menu__container">
                  <TabPanel>
                    {sourceTree && <ExprTree tree={sourceTree} />}
                  </TabPanel>
                  <TabPanel>
                    {typedTree && <ExprTree tree={typedTree} />}
                  </TabPanel>
                  <TabPanel>
                    {context && <ExprTree tree={context} />}
                  </TabPanel>
                  <TabPanel>
                    {normalTree && <ExprTree tree={normalTree} />}
                  </TabPanel>
                  <TabPanel>
                    {stage1Tree && <ExprTree tree={stage1Tree} />}
                  </TabPanel>
                  <TabPanel>
                    {stage2Tree && <ExprTree tree={stage2Tree} />}
                  </TabPanel>
                  <TabPanel>
                    {stage3Tree && <ExprTree tree={stage3Tree} />}
                  </TabPanel>
                  <TabPanel>
                    {stage4Tree && <ExprTree tree={stage4Tree} />}
                  </TabPanel>
                  <TabPanel>
                    {coreExpr && <ExprTree tree={coreExpr} />}
                  </TabPanel>
                  <TabPanel>
                    {value && <ExprTree tree={value} />}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </ReflexElement>
          <ReflexSplitter style={{ height: '8px' }} />
          <ReflexElement>
            <div className="pane-content">
              <div>
                <button onClick={() => { setLogOutput(''); }}>
                  Clear log
                </button>
              </div>
              <div>
                {logOutput}
              </div>
            </div>
          </ReflexElement>
        </ReflexContainer>
      </Box>
    </ChakraProvider>
  );
}

export default App;

// import "./App.scss";
// import React, { useState, useContext } from "react";
// import axios from "./axios";
// import ExprPipeline from "./components/ExprPipeline";
// import Pane from "./components/Pane";
// import PaneSection from "./components/PaneSection";
// import SplitPane from "react-split-pane";
// import {
//   Accordion,
//   Box,
//   Button,
//   Table,
//   VStack,
//   Tr,
//   Td,
//   Textarea,
//   Tbody,
//   ChakraProvider,
// } from "@chakra-ui/react";
// //import bundle from "./tmp/bundle";
// import { AiFillTag } from "react-icons/ai";
// import { AppContext, AppContextProvider } from "./contexts/App";
// import { Global, css } from "@emotion/react";
// import { IoIosArrowDroprightCircle } from "react-icons/io";
// import { TreeMenuContainer } from "./components/TreeMenu";
//
// function ModulePane() {
//   const TableCell = ({ children }) => (
//     <Td borderTop="1px solid #e2e8f0" borderBottom="none" py={2} px={3}>
//       <Box d="flex" alignItems="center">
//         {children}
//       </Box>
//     </Td>
//   );
//
//   const TableRow = ({ children }) => {
//     return (
//       <Tr cursor="pointer" _hover={{ background: "rgba(0, 0, 0, 0.04)" }}>
//         {React.Children.toArray(children).map((child, i) => (
//           <React.Fragment key={i}>{child}</React.Fragment>
//         ))}
//       </Tr>
//     );
//   };
//
//   return (
//     <Accordion reduceMotion={true} defaultIndex={[0]} allowMultiple>
//       <PaneSection title="Imports">section 1</PaneSection>
//       <PaneSection title="Definitions">
//         <Table size="sm">
//           <Tbody>
//             <TableRow>
//               <TableCell>
//                 <Box mr={1}>
//                   <IoIosArrowDroprightCircle />
//                 </Box>
//                 main
//               </TableCell>
//               <TableCell>Int &rarr; IO ()</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>
//                 <Box mr={1}>
//                   <IoIosArrowDroprightCircle />
//                 </Box>
//                 toString
//               </TableCell>
//               <TableCell>a &rarr; String</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>
//                 <Box mr={1}>
//                   <IoIosArrowDroprightCircle />
//                 </Box>
//                 factorial
//               </TableCell>
//               <TableCell>Nat &rarr; Nat</TableCell>
//             </TableRow>
//           </Tbody>
//         </Table>
//       </PaneSection>
//       <PaneSection title="Type declarations">
//         <Table size="sm">
//           <Tbody>
//             <TableRow>
//               <TableCell>
//                 <Box mr={1}>
//                   <AiFillTag />
//                 </Box>
//                 List a
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Nat</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Option a</TableCell>
//             </TableRow>
//           </Tbody>
//         </Table>
//       </PaneSection>
//       <PaneSection title="Classes">section 4</PaneSection>
//       <PaneSection title="Class instances">section 5</PaneSection>
//     </Accordion>
//   );
// }
//
// function ModulesList() {
//   //const testTree = [
//   //  {
//   //    nodeName: "Main",
//   //    children: [],
//   //  },
//   //  {
//   //    nodeName: "List",
//   //    children: [],
//   //  },
//   //  {
//   //    nodeName: "List",
//   //    expandedIcon: AiFillFolder,
//   //    collapsedIcon: AiFillFolder,
//   //    expanded: true,
//   //    children: [
//   //      {
//   //        nodeName: "List.Extra",
//   //        children: [],
//   //      },
//   //      {
//   //        nodeName: "List.NonEmpty",
//   //        children: [],
//   //      },
//   //    ],
//   //  },
//   //];
//
//   //const { treeNodes, handleNodeToggled } = useMenu(testTree);
//
//   return (
//     <TreeMenuContainer>
//       {/*
//       <Tree nodes={treeNodes} onToggleNode={handleNodeToggled} />
//       */}
//     </TreeMenuContainer>
//   );
// }
//
// function Layout() { // eslint-disable-line no-unused-vars
//   return (
//     <SplitPane split="horizontal" defaultSize={20}>
//       <Pane />
//       <SplitPane split="horizontal" defaultSize={200} primary="second">
//         <SplitPane split="vertical" defaultSize={150}>
//           <Pane title="Modules">
//             <ModulesList />
//           </Pane>
//           <SplitPane split="vertical" defaultSize={200}>
//             <Pane title="Main">
//               <ModulePane />
//             </Pane>
//             <Pane title="Main.factorial">
//               {/*
//               <ExprPipeline bundle={bundle} />
//               */}
//             </Pane>
//           </SplitPane>
//         </SplitPane>
//         <Pane>xx</Pane>
//       </SplitPane>
//     </SplitPane>
//   );
// }
//
// function Layout2() {
//   const [source, setSource] = useState("");
//   const { setBundle } = useContext(AppContext);
//   //const [bundle, setBundle] = useState();
//
//   const handleClick = async () => {
//     const res = await axios.post("/run", { source });
//     try {
//       const bundle = JSON.parse(res.data.bundle);
//       setBundle(bundle);
//       console.log(bundle);
//     } catch (e) {
//       console.error(e);
//     }
//   };
//
//   return (
//     <>
//             <Textarea
//               fontFamily="monospace"
//               onChange={(e) => {
//                 setSource(e.target.value);
//               }}
//               value={source}
//             />
//             <Button onClick={handleClick}>asfdadsf</Button>
//
//       <div><ExprPipeline /></div>
//     </>
//   );
// //    <SplitPane split="horizontal" defaultSize={300}>
// //      <SplitPane split="vertical" defaultSize={600}>
// //        <Pane>
// //          <VStack>
// //            <Textarea
// //              fontFamily="monospace"
// //              onChange={(e) => {
// //                setSource(e.target.value);
// //              }}
// //              value={source}
// //            />
// //            <Button onClick={handleClick}>asfdadsf</Button>
// //          </VStack>
// //        </Pane>
// //        <Pane>
// //          {/*
// //          {bundle && (
// //            <ExprPipeline bundle={bundle} />
// //          )}
// //          */}
// //        </Pane>
// //      </SplitPane>
// //      {/*
// //      <div>{bundle && <ExprPipeline bundle={bundle} />}</div>
// //      */}
// //      <div><ExprPipeline /></div>
// //      {/*
// //      <ExprPipeline bundle={bundle} />
// //      */}
// //    </SplitPane>
// //  );
// }
//
// const GlobalStyles = css`
//   /*
//     This will hide the focus indicator if the element receives focus via the mouse,
//     but it will still show up on keyboard focus.
//   */
//   .js-focus-visible :focus:not([data-focus-visible-added]) {
//     outline: none;
//     box-shadow: none;
//   }
// `;
//
// function App() {
//   return (
//     <ChakraProvider>
//       <Global styles={GlobalStyles} />
//       <AppContextProvider>
//         <Box w="100%" h="100vh">
//           <Layout2 />
//         </Box>
//       </AppContextProvider>
//     </ChakraProvider>
//   );
// }
//
// export default App;
