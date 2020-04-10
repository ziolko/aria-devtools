import React from "react";
import ReactDOM from "react-dom";

function getDiv() {
  if (document.getElementById("root-a11-view")) {
    return document.getElementById("root-a11-view");
  }

  const div = document.createElement("div");
  div.setAttribute("id", "root-a11-view");
  div.setAttribute("aria-hidden", "true");

  document.body.appendChild(div);
  return div;
}

function render() {
  const App = require("./App").default;
  ReactDOM.unmountComponentAtNode(getDiv());
  ReactDOM.render(<App />, getDiv());
}

render();

if (module.hot) {
  module.hot.accept(function() {
    render();
  });
}
