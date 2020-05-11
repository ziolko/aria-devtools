import React, { SyntheticEvent } from "react";
import { AOMElement, NodeElement } from "./AOM/types";
import Main from "./view/Main";
import Observer from "./store/observer";
import { createGlobalStyle } from "styled-components";
import { Provider } from "./store-context";

const DisableMainScrollbar = createGlobalStyle`
  html, body {
    ::-webkit-scrollbar {
      width: 0 !important;   
      background: transparent !important;
    }
  }
`;

const useDisableMouseEvents = (disableEvents: boolean, rootRef: React.RefObject<HTMLDivElement>) => {
  React.useEffect(() => {
    if (!disableEvents) {
      return;
    }

    const onClick = (e: MouseEvent) => {
      if (rootRef.current && rootRef.current.contains(e.target as Node)) {
        const target = e.composedPath()[0];
        target?.dispatchEvent(new Event(e.type, { bubbles: true }));

        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mousedown", onClick, true);
    document.addEventListener("mouseup", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousedown", onClick, true);
      document.removeEventListener("mouseup", onClick, true);
    };
  }, [disableEvents]);
};

export default () => {
  const [rootNode, setRootNode] = React.useState<AOMElement>(null);
  const observer = React.useRef<Observer>(null);
  const [isVisible, setVisible] = React.useState(true);
  const mainRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        setVisible(!isVisible);
      }
    };

    document.addEventListener("keydown", handler, true);

    return () => document.removeEventListener("keydown", handler, true);
  }, [isVisible, setVisible]);

  React.useEffect(() => {
    // @ts-ignore
    observer.current = new Observer(document.body);
    setRootNode(observer.current.root);
    return () => observer.current?.disconnect();
  }, [observer, setRootNode]);

  useDisableMouseEvents(isVisible, mainRef);

  return (
    <Provider value={observer?.current?.store}>
      <div ref={mainRef} style={isVisible ? {} : { visibility: "hidden" }}>
        {isVisible && <DisableMainScrollbar />}
        <Main root={rootNode} />
      </div>
    </Provider>
  );
};
