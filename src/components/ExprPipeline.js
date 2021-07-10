import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Stack,
  ButtonGroup,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { BiCollapse, BiExpand } from "react-icons/bi";
import { Tree, useMenu, builder } from "./TreeMenu";

function ExprPipeline({ bundle }) {
  const ExprTree = ({ tree }) => {
    const { treeNodes, handleNodeToggled, collapseAll, expandAll } = useMenu([
      builder(tree),
    ]);

    return (
      <>
        <Stack direction="row" mb={2}>
          <ButtonGroup variant="outline" size="xs" spacing="1">
            <Button borderRadius={0}>New</Button>
            <IconButton onClick={collapseAll} icon={<BiCollapse />} />
            <IconButton onClick={expandAll} icon={<BiExpand />} />
          </ButtonGroup>
        </Stack>
        <Tree nodes={treeNodes} onToggleNode={handleNodeToggled} />
      </>
    );
  };

  return (
    <Tabs size="sm" width="100%" height="100%">
      <TabList>
        <Tab>Source tree</Tab>
        <Tab>Typed tree</Tab>
        <Tab>S1</Tab>
        <Tab>S2</Tab>
        <Tab>S3</Tab>
        <Tab>S4</Tab>
        <Tab>S5</Tab>
        <Tab>Core</Tab>
        <Tab>Evaluated</Tab>
      </TabList>
      <TabPanels h="100%" overflow="auto" className="tree-menu__container">
        <TabPanel>
          <ExprTree tree={bundle.source} />
        </TabPanel>
        <TabPanel>TODO</TabPanel>
        <TabPanel>
          <ExprTree tree={bundle.stage1} />
        </TabPanel>
        <TabPanel>
          <ExprTree tree={bundle.stage2} />
        </TabPanel>
        <TabPanel>
          <ExprTree tree={bundle.stage3} />
        </TabPanel>
        <TabPanel>
          <ExprTree tree={bundle.stage4} />
        </TabPanel>
        <TabPanel>
          <ExprTree tree={bundle.stage5} />
        </TabPanel>
        <TabPanel>
          <ExprTree tree={bundle.core} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ExprPipeline;
