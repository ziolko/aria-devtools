import * as React from "react";
import { expect } from "chai";
import sandbox from "./sandbox";

describe("Dynamic HTML", () => {
  it("Should parse a single div", () => {
    const { AOM } = sandbox(<div id="result">Hello world</div>);
    expect(AOM.result).to.exist;
  });

  it("Should parse a nested div", () => {
    const { AOM } = sandbox(
      <div id="test1">
        Hello world
        <div id="test2">Another div</div>
      </div>
    );

    expect(AOM.test1).to.exist;
    expect(AOM.test2).to.exist;
  });

  it("Should react to dynamic changes in a list of nodes", async () => {
    const { AOM, render } = sandbox(({ before, after, middle, nested }) => (
      <div id="container">
        {before && <div id="before">Before</div>}
        <div id="static1">First static node</div>
        {middle && (
          <div id="middle">{nested && <div id="nested">Middle</div>}</div>
        )}
        <div id="static2">Second static node</div>
        {after && <div id="after">After</div>}
      </div>
    ));

    const contentIds = () => AOM.container.htmlChildren.map((x: any) => x.id);

    expect(contentIds()).to.deep.equal(["static1", "static2"]);

    await render({ before: true, middle: true, after: true });

    expect(contentIds()).to.deep.equal([
      "before",
      "static1",
      "middle",
      "static2",
      "after"
    ]);

    await render({ before: true, middle: true, nested: true, after: true });

    expect(AOM.nested).to.exist;

    await render({ before: true, after: true });

    expect(contentIds()).to.deep.equal([
      "before",
      "static1",
      "static2",
      "after"
    ]);

    expect(AOM.nested).to.not.exist;
  });

  it("Should react to dynamic change in node ID", async () => {
    const { AOM, render } = sandbox(({ labelID = null }) => (
      <div>
        <div id={labelID}>Label</div>
        <div id="node1" aria-labelledby="label1">
          Node1
        </div>
        <div id="node2" aria-labelledby="label2">
          Node2
        </div>
      </div>
    ));

    expect(AOM.node1.relations.ariaLabelledBy).to.be.empty;
    expect(AOM.node2.relations.ariaLabelledBy).to.be.empty;
    expect(AOM.node1.accessibleName).to.equal("Node1");

    await render({ labelID: "label1" });

    expect(AOM.node1.relations.ariaLabelledBy[0]).to.equal(AOM.label1);
    expect(AOM.node2.relations.ariaLabelledBy).to.be.empty;
    expect(AOM.label1.relations.ariaLabelOf[0]).to.equal(AOM.node1);
    expect(AOM.node1.accessibleName).to.equal("Label");

    await render({ labelID: "label2" });

    expect(AOM.node1.relations.ariaLabelledBy).to.be.empty;
    expect(AOM.node2.relations.ariaLabelledBy[0]).to.equal(AOM.label2);
    expect(AOM.label2.relations.ariaLabelOf[0]).to.equal(AOM.node2);
    expect(AOM.node1.accessibleName).to.equal("Node1");

    await render({ labelID: "label3" });

    expect(AOM.node1.relations.ariaLabelledBy).to.be.empty;
    expect(AOM.node2.relations.ariaLabelledBy).to.be.empty;
    expect(AOM.label3.relations.ariaLabelOf).to.be.empty;
  });
});
