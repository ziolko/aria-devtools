import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "../store-context";

const AriaLiveWrapper = styled.div<{ level: string }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ level }) => (level === "polite" ? "#0a3f0a" : "#3f0a0a")};
  z-index: 10;
  padding: 10px;
`;

export default observer(function AriaLive() {
  const store = useStore();
  const currentAlarm = store.activeAlerts.length > 0 ? store.activeAlerts[0] : null;

  React.useEffect(() => {
    if (!currentAlarm) {
      return;
    }
    const handler = () => store.acknowledgeAlert(currentAlarm.source);
    document.addEventListener("keydown", handler, true);
    return () => {
      document.removeEventListener("keydown", handler, true);
    };
  }, [currentAlarm, store.acknowledgeAlert]);

  if (!currentAlarm) {
    return null;
  }

  return (
    <AriaLiveWrapper onClick={() => store.acknowledgeAlert(currentAlarm.source)} level={currentAlarm.ariaLive}>
      <div style={{ marginBottom: 20 }}>{currentAlarm.content}</div>
      <em>Note: Click anywhere or press any key to acknowledge the message</em>
    </AriaLiveWrapper>
  );
});
