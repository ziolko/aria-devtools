import React from "react";
import styled from "styled-components";
import { AOMElement } from "../AOM/types";
import Component from "./renderers";
import font from "./font";
// @ts-ignore
import root from "react-shadow";
import AriaLive from "./AriaLive";
import SidePanel from "./side-panel";

const Layout = styled(root.div)`
  margin: 0 !important;
  padding: 0 !important;
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

export default (props: MainProps) => {
  return (
    <Layout>
      <ComponentWithScrollBar element={props.root} id="aria-dev-tools-scroll-parent" />
      <SidePanel />
      <AriaLive />
    </Layout>
  );
};
