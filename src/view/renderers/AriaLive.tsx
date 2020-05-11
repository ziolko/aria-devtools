import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "../../store-context";
import { NodeElement } from "../../AOM/types";

const ActiveAlert = styled.div<{ level: string }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ level }) => (level === "polite" ? "#0a3f0a" : "#3f0a0a")};
  z-index: 10;
  padding: 10px;
`;

export default observer(function Alert({ node, children }: { node: NodeElement; children: any }) {
  const store = useStore();

  const alertText = node.children
    .map(x => x.accessibleName)
    .join(" ")
    .trim();

  const isVisible = node.isActiveAlarm && !!alertText;

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }
    const handler = () => store.clearActiveAriaLiveNode(node);
    document.addEventListener("keydown", handler, true);
    return () => {
      document.removeEventListener("keydown", handler, true);
    };
  }, [isVisible, store.clearActiveAriaLiveNode]);

  return (
    <>
      {isVisible && (
        <ActiveAlert onClick={() => store.clearActiveAriaLiveNode(node)} level={node.attributes.ariaLive}>
          <div style={{ marginBottom: 20 }}>{alertText}</div>
          <em>Note: Click anywhere or press any key to acknowledge the message</em>
        </ActiveAlert>
      )}
      {children}
    </>
  );
});
