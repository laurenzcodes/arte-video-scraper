import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import LinkHandler from "./components/linkHandler";

const App = () => {
  return (
    <div className="App">
      <Layout>
        <Content style={{ backgroundColor: "white" }}>
          <LinkHandler />
        </Content>
      </Layout>
    </div>
  );
};

export default App;
