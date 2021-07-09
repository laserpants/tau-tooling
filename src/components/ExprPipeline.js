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
  if (Array.isArray(obj)) {
    return {
      nodeName: "<collection>",
      expandedIcon: FaMinusSquare,
      collapsedIcon: FaPlusSquare,
      children: obj.map(build),
    };
  }

  if (!obj || !obj.meta) {
    return {
      nodeName: obj,
      expandedIcon: FaMinusSquare,
      collapsedIcon: FaPlusSquare,
      children: [],
    };
  }

  const [datatype, con] = obj.meta;

  return {
    nodeName: con,
    expandedIcon: FaMinusSquare,
    collapsedIcon: FaPlusSquare,
    children: Array.isArray(obj.children) ? obj.children.map(build) : [],
  };
}

function ExprPipeline({ bundle }) {
  //console.log(bundle.stage1);

  console.log(build(bundle.stage1));

  const testTree = [build(bundle.stage1)];

  //  const testTree = [
  //    {
  //      nodeName: "EFix",
  //      expandedIcon: FaMinusSquare,
  //      collapsedIcon: FaPlusSquare,
  //      children: [
  //        {
  //          nodeName: "ELam",
  //          expandedIcon: FaMinusSquare,
  //          collapsedIcon: FaPlusSquare,
  //          children: [
  //            {
  //              nodeName: "ELam",
  //              children: [],
  //            },
  //            {
  //              nodeName: "ELam",
  //              children: [],
  //            },
  //            {
  //              nodeName: "ELam",
  //              children: [],
  //            },
  //          ],
  //        },
  //        {
  //          nodeName: "ELet",
  //          expandedIcon: FaMinusSquare,
  //          collapsedIcon: FaPlusSquare,
  //          children: [
  //            {
  //              nodeName: "ELam",
  //              children: [],
  //            },
  //            {
  //              nodeName: "ELam",
  //              children: [],
  //            },
  //          ],
  //        },
  //      ],
  //    },
  //  ];

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
          {/*
                  <pre style={{ fontSize: '10px' }}>
                    {JSON.stringify(treeNodes, null, 2)}
                  </pre>
                */}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ExprPipeline;
