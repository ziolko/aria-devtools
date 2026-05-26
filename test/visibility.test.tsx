import * as React from "react";
import { expect } from "chai";
import sandbox from "./sandbox";

describe("Element visibility", () => {
  it("Should mark elements with the inert attribute as hidden", () => {
    const { AOM } = sandbox(
      <div>
        <div id="inert" inert="" data-hello="world">
          <button>click me</button>
        </div>
        <div id="visible">
          <button>click me</button>
        </div>
      </div>
    );

    // The inert element is hidden; the renderer drops its whole subtree.
    expect(AOM.inert.isHidden, "inert element").to.be.true;
    expect(AOM.visible.isHidden, "visible element").to.be.false;
  });

  it("Should mark elements with the aria-hidden attribute as hidden", () => {
    const { AOM } = sandbox(
      <div>
        <div id="hidden" aria-hidden="true">
          text
        </div>
        <div id="visible" aria-hidden="false">
          text
        </div>
      </div>
    );

    expect(AOM.hidden.isHidden, "aria-hidden=true").to.be.true;
    expect(AOM.visible.isHidden, "aria-hidden=false").to.be.false;
  });

  it("Should mark elements with the hidden attribute as hidden", () => {
    const { AOM } = sandbox(
      <div>
        <div id="hidden" hidden>
          text
        </div>
        <div id="visible">text</div>
      </div>
    );

    expect(AOM.hidden.isHidden, "hidden attribute").to.be.true;
    expect(AOM.visible.isHidden, "no hidden attribute").to.be.false;
  });

  it("Should mark elements with display: none as hidden", () => {
    const { AOM } = sandbox(
      <div>
        <div id="hidden" style={{ display: "none" }}>
          text
        </div>
        <div id="visible" style={{ display: "block" }}>
          text
        </div>
      </div>
    );

    expect(AOM.hidden.isHidden, "display: none").to.be.true;
    expect(AOM.visible.isHidden, "display: block").to.be.false;
  });

  it("Should mark elements with visibility: hidden as hidden", () => {
    const { AOM } = sandbox(
      <div>
        <div id="hidden" style={{ visibility: "hidden" }}>
          text
        </div>
        <div id="visible" style={{ visibility: "visible" }}>
          text
        </div>
      </div>
    );

    expect(AOM.hidden.isHidden, "visibility: hidden").to.be.true;
    expect(AOM.visible.isHidden, "visibility: visible").to.be.false;
  });
});
