import * as React from "react";
import { expect } from "chai";
import sandbox from "./sandbox";

describe("Accessible name", () => {
  it("Should get accessible name for a single div", () => {
    const { AOM } = sandbox(<div id="result">Hello world</div>);

    expect(AOM.result.accessibleName).to.equal("Hello world");
  });

  it("Should return aria-label instead of content", () => {
    const { AOM } = sandbox(
      <div id="result" aria-label="Label content">
        Hello world
      </div>
    );

    expect(AOM.result.accessibleName).to.equal("Label content");
  });

  it("Should return aria-labelledby instead of content", () => {
    const { AOM } = sandbox(
      <>
        <div id="id1">Another div</div>
        <div id="result" aria-labelledby="id1">
          Hello world
        </div>
      </>
    );

    expect(AOM.result.accessibleName).to.equal("Another div");
  });

  it("Should skip recurring aria-labelledby", () => {
    const { AOM } = sandbox(
      <div id="id1">
        <div aria-labelledby="id1" id="result">
          This should not be included
        </div>
        <div>Result label</div>
      </div>
    );

    expect(AOM.result.accessibleName.trim()).to.equal("Result label");
  });
});
