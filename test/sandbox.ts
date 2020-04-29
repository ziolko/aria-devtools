import { NodeElement } from "../src/AOM/types";
import { getNodeKey } from "../src/AOM/utils";
import Observer from "../src/store/observer";
import { render } from "react-dom";
import { createElement, ReactElement } from "react";

type SandboxResult<T> = {
  DOM: { [key: string]: HTMLElement };
  AOM: { [key: string]: NodeElement };
  render: (props: T) => Promise<void>;
  updateSideEffects: () => void;
};

const sandboxRoot = document.getElementById("sandbox");
let observer: Observer;

export default function sandbox<T>(
  markup: ReactElement | ((props: T) => ReactElement)
): SandboxResult<T> {
  if (observer) {
    observer.disconnect();
  }

  if (typeof markup === "function") {
    render(createElement(markup), sandboxRoot);
  } else {
    render(markup, sandboxRoot);
  }

  observer = new Observer(sandboxRoot);

  return {
    AOM: new Proxy(
      {},
      {
        get(target, prop) {
          const selector = `#${String(prop)}`;
          const node = sandboxRoot.querySelector(selector);
          return (
            node && (observer.store.getElement(getNodeKey(node)) as NodeElement)
          );
        }
      }
    ),
    DOM: new Proxy(
      {},
      {
        get: (target, prop) => {
          const selector = `#${String(prop)}`;
          return sandboxRoot.querySelector(selector);
        }
      }
    ),
    render: props => {
      if (typeof markup === "function") {
        return new Promise(resolve =>
          render(createElement(markup, props), sandboxRoot, resolve)
        );
      }
    },
    updateSideEffects: () => observer.updateSideEffects()
  };
}
