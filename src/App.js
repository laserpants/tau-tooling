import "./App.scss";
import React from "react";
import SplitPane from "react-split-pane";
import { Box, ChakraProvider } from "@chakra-ui/react";

function Layout() {
  return (
    <>
      <SplitPane split="horizontal" defaultSize={100}>
        <div>xx</div>
        <SplitPane split="horizontal" defaultSize={200} primary="second">
          <SplitPane split="vertical" defaultSize={150}>
            <div>pane1</div>
            <SplitPane split="vertical" defaultSize={200}>
              <div>pane2</div>
              <div>pane3</div>
            </SplitPane>
          </SplitPane>
          <div>xx</div>
        </SplitPane>
      </SplitPane>
    </>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Box w="100%" h="100vh">
        <Layout />
      </Box>
    </ChakraProvider>
  );
}

export default App;
