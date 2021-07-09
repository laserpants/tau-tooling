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
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { BiCollapse, BiExpand } from "react-icons/bi";
import { Tree, useMenu } from "./TreeMenu";

function build(obj) {
  let attributes = {
    expandedIcon: FaMinusSquare,
    collapsedIcon: FaPlusSquare,
  };

  if (Array.isArray(obj)) {
    return {
      ...attributes,
      nodeName: "[]",
      children: obj.map(build),
    };
  }

  if (!obj.meta) {
    return {
      ...attributes,
      nodeName: obj,
      children: [],
    };
  }

  const [datatype, con] = obj.meta;

  return {
    ...attributes,
    nodeName: con,
    datatype,
    children: Array.isArray(obj.children) ? obj.children.map(build) : [],
  };
}

function ExprPipeline({ bundle }) {
  const testTree = [build(bundle.stage1)];

  const { treeNodes, handleNodeToggled, collapseAll, expandAll } =
    useMenu(testTree);

  return (
    <Tabs size="sm" width="100%" height="100%">
      <TabList>
        <Tab>Source tree</Tab>
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
          <Stack direction="row" mb={2}>
            <ButtonGroup variant="outline" size="xs" spacing="1">
              <Button borderRadius={0}>New</Button>
              <IconButton onClick={collapseAll} icon={<BiCollapse />} />
              <IconButton onClick={expandAll} icon={<BiExpand />} />
            </ButtonGroup>
          </Stack>
          <Tree nodes={treeNodes} onToggleNode={handleNodeToggled} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ExprPipeline;
