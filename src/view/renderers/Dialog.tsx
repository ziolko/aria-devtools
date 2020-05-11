import { BlockTemplate } from "./Block";
import React from "react";
import { observer } from "mobx-react";
import { ComponentProps, getHeader, renderContext, useFocusable } from "./utils";
import styled, { css } from "styled-components";

const Glass = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0;
  right: 8px; // scrollbar
  top: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  z-index: 9;
`;

const DialogBlock = styled(BlockTemplate)<{ isActiveModal: boolean }>`
  z-index: ${props => (props.isActiveModal ? "10" : "auto")};
`;

export default observer(function Dialog({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, style] = useFocusable(node);
  const header = getHeader(
    node.hasCustomAccessibleName ? node.accessibleName : undefined,
    node.attributes.ariaModal === true ? "(Modal dialog)" : "(Non-modal dialog)"
  );
  const isActiveModal: boolean = !!node.attributes.ariaModal && !!node.containsFocus;

  return (
    <>
      {isActiveModal && <Glass />}
      <DialogBlock ref={ref} isActiveModal={isActiveModal} role={`${node.role}`} style={style} header={header}>
        {render(node.children)}
      </DialogBlock>
    </>
  );
});
