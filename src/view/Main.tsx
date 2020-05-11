import React, { SyntheticEvent } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { AOMElement } from "../AOM/types";
import Component from "./renderers";
import font from "./font";

// @ts-ignore
import root from "react-shadow";

const bottomBarHeight = "30px";

// prettier-ignore
const Layout = styled(root.div)`
    margin: 0;
    border: 0;
    vertical-align: initial;
    line-height: initial;
    widows: initial;
    orphans: initial;
    overflow-wrap: initial;
    user-select: none;
    width: initial;
    height: initial;
    border-radius: 0;
    text-align: left;
    
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2147483648;
    background: #222;
    color: #eee;

    ${font};
    display: flex;   
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
`

export default (props: MainProps) => {
  return (
    <Layout>
      <ComponentWithScrollBar element={props.root} />
      {/*<ActionsBar>Test</ActionsBar>*/}
    </Layout>
  );
};
