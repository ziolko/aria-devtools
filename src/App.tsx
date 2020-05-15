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

const useDisableMouseEvents = (rootRef: React.RefObject<HTMLDivElement>) => {
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && rootRef.current.contains(e.target as Node)) {
        const target = e.composedPath()[0];
        target?.dispatchEvent(new Event(e.type, { bubbles: true }));

        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("mousedown", onClick, true);
    window.addEventListener("mouseup", onClick, true);

    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("mousedown", onClick, true);
      window.removeEventListener("mouseup", onClick, true);
    };
  }, []);
};

export default () => {
  const [rootNode, setRootNode] = React.useState<AOMElement>(null);
  const observer = React.useRef<Observer>(null);
  const mainRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // @ts-ignore
    observer.current = new Observer(document.body);
    setRootNode(observer.current.root);
    return () => observer.current?.disconnect();
  }, [observer, setRootNode]);

  useDisableMouseEvents(mainRef);

  return (
    <Provider value={observer?.current?.store}>
      <div ref={mainRef}>
        <DisableMainScrollbar />
        <Main root={rootNode} />
      </div>
    </Provider>
  );
};
