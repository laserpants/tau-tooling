import React, { useEffect, useState, useContext } from "react";
import {
  Tabs,
  Spinner,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Stack,
  ButtonGroup,
  IconButton,
  //  Button,
} from "@chakra-ui/react";
import { BiCollapse, BiExpand } from "react-icons/bi";
import { Tree } from "./TreeMenu";
import treeWorker from "../worker.js";
import { TreeContextProvider } from "../contexts/Tree";
import { TreeContext } from "../contexts/Tree";

function ExprPipeline({ bundle }) {
  const ExprTree = ({ tree }) => {
    const [compiledTree, setCompiledTree] = useState();
    const [working, setWorking] = useState(false);
    const { initialize, expandAll, collapseAll } = useContext(TreeContext);

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
            initialize(map);
            setWorking(false);
            break;
          default:
            break;
        }
      };
      worker.postMessage(tree);
    }, [tree, setCompiledTree, initialize]);

    return (
      <>
        {working ? (
          <Spinner />
        ) : (
          <>
            <Stack direction="row" mb={2}>
              <ButtonGroup variant="outline" size="xs" spacing="1">
                {/*
                <Button borderRadius={0}>New</Button>
                */}
                <IconButton onClick={collapseAll} icon={<BiCollapse />} />
                <IconButton onClick={expandAll} icon={<BiExpand />} />
              </ButtonGroup>
            </Stack>
            {compiledTree && <Tree nodes={[compiledTree]} />}
          </>
        )}
      </>
    );
  };

  return (
    <Tabs size="sm" width="100%" height="100%">
      <TabList>
        <Tab>Source tree</Tab>
        <Tab>Typed tree</Tab>
        {/*
        <Tab>Typed tree</Tab>
        <Tab>S1</Tab>
        <Tab>Sx</Tab>
        <Tab>Sx2</Tab>
        <Tab>Sx3</Tab>
        <Tab>Sx5</Tab>
        <Tab>Sx6</Tab>
        <Tab>Normal?</Tab>
        <Tab>S2</Tab>
        <Tab>S3</Tab>
        <Tab>S4</Tab>
        <Tab>S5</Tab>
        <Tab>Core</Tab>
        {bundle.value && <Tab>Evaluated</Tab>}
        {bundle.value2 && <Tab>Evaluated2</Tab>}
        */}
      </TabList>
      <TabPanels h="100%" overflow="auto" className="tree-menu__container">
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.source} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.typed} />
          </TreeContextProvider>
        </TabPanel>
        {/*
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.typed} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stage1} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stageX} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stageX2} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stageX3} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stageX5} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stageX6} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.normal} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stage2} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stage3} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stage4} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.stage5} />
          </TreeContextProvider>
        </TabPanel>
        <TabPanel>
          <TreeContextProvider>
            <ExprTree tree={bundle.core} />
          </TreeContextProvider>
        </TabPanel>
        {bundle.value && (
          <TabPanel>
            <TreeContextProvider>
              <ExprTree tree={bundle.value} />
            </TreeContextProvider>
          </TabPanel>
        )}
        {bundle.value2 && (
          <TabPanel>
            <TreeContextProvider>
              <ExprTree tree={bundle.value2} />
            </TreeContextProvider>
          </TabPanel>
        )}
        */}
      </TabPanels>
    </Tabs>
  );
}

export default ExprPipeline;
