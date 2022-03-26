import React from "react";
import ReactDOM from "react-dom";

function getContainer(): HTMLElement {
  let container = document.getElementById("root-a11-view");

  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", "root-a11-view");
    container.setAttribute("aria-hidden", "true");

    document.body.appendChild(container);
  }

  return container;
}

function mount() {
  const App = require("./App").default;
  const container = getContainer();
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    ReactDOM.render(<App />, container);
  }
}

function unmount() {
  const container = getContainer();
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
  }
}

function waitForBody() {
  return new Promise(resolve => {
    if (document.body) {
      return resolve();
    }

    const observer = new MutationObserver(function() {
      if (document.body) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.documentElement, { childList: true });
  });
}

let isEnabled = false;

window.isLoaded = true;
window.enable = async () => {
  isEnabled = true;
  await waitForBody();
  if (isEnabled) {
    mount();
  }
};

window.disable = async () => {
  isEnabled = false;
  await waitForBody();
  if (!isEnabled) {
    unmount();
  }
};

if (module.hot) {
  module.hot.accept(function() {
    if (isEnabled) {
      mount();
    }
  });
}
