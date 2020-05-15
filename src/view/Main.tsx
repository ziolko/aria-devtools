import React, { SyntheticEvent } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { AOMElement } from "../AOM/types";
import Component from "./renderers";
import font from "./font";

// @ts-ignore
import root from "react-shadow";
import AriaLive from "./AriaLive";

const bottomBarHeight = "30px";

// prettier-ignore
const Layout = styled(root.div)`
    margin: 0 !important;
    border: 0 !important;
    vertical-align: initial !important;
    line-height: initial !important;
    widows: initial !important;
    orphans: initial !important;
    overflow-wrap: initial !important;
    user-select: none !important;
    width: initial !important;
    height: initial !important;
    border-radius: 0 !important;
    text-align: left !important;
    
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    z-index: 2147483648 !important;
    background: #222 !important;
    color: #eee !important;

    ${font};
    display: flex !important;
`;

export interface MainProps {
  root: AOMElement;
}

const ComponentWithScrollBar = styled(Component)`
  flex: 1 1 0;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 2px;
  }
`;

const ActionsBar = styled.div`
  flex: 0 1 400px;
  background: #333;
  line-height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  border-left: 1px solid #555;
`;

const Alert = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: red;
`;

export default (props: MainProps) => {
  return (
    <Layout>
      <ComponentWithScrollBar element={props.root} id="aria-dev-tools-scroll-parent" />
      <AriaLive />
      {/*<ActionsBar>Test</ActionsBar>*/}
    </Layout>
  );
};
