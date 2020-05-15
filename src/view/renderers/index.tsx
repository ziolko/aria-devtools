import React from "react";
import { AOMElement } from "../../AOM/types";
import { renderContext } from "./utils";
import render from "./render";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 0 10px;
  --block-display: block;

  ::before,
  ::after {
    content: "";
    display: block;
    margin-top: 10px;
  }
`;

export default function Component(props: { element: AOMElement; className?: string; id: string }) {
  return (
    <renderContext.Provider value={render}>
      <Wrapper className={props.className} id={props.id}>
        {render(props.element)}
      </Wrapper>
    </renderContext.Provider>
  );
}
