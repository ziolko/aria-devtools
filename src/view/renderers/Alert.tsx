import { BlockTemplate } from "./Block";
import React from "react";
import { observer } from "mobx-react";
import { ComponentProps, renderContext, useFocusable } from "./utils";
import styled from "styled-components";
import { useStore } from "../../store-context";

const ActiveAlert = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #3f0a0a;
  z-index: 10;
  padding: 0 10px;
`;

export default observer(function Alert({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, style] = useFocusable(node);
  const store = useStore();
  const label = node.hasCustomAccessibleName ? node.accessibleName : undefined;

  const alertText = node.children
    .map(x => x.accessibleName)
    .join(" ")
    .trim();

  return (
    <>
      {node.isActiveAlarm && alertText && (
        <ActiveAlert onClick={() => void store.setActiveAlarmNode(null)}>
          <BlockTemplate role={`${node.role}`} ref={ref} style={style} header={label}>
            {alertText}
          </BlockTemplate>
          <em>Note: Click anywhere to acknowledge the message</em>
        </ActiveAlert>
      )}

      <BlockTemplate role={`${node.role}`} ref={ref} style={style} header={label}>
        {render(node.children)}
      </BlockTemplate>
    </>
  );
});
