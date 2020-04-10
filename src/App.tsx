import React from "react";
import { AOMElement, NodeElement } from "./AOM/types";
import Main from "./view/Main";
import Observer from "./store/observer";

export default () => {
  const [rootNode, setRootNode] = React.useState<AOMElement>(null);
  const observer = React.useRef<Observer>(null);
  const [isVisible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {

      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a") ) {
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

  return isVisible && <Main root={rootNode} />;
};
