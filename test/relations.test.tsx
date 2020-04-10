import * as React from "react";
import { expect } from "chai";
import sandbox from "./sandbox";

describe("Relations", () => {
  it("Should understand HTML 'for' label", () => {
    const { AOM } = sandbox(
      <div>
        <label id="label" htmlFor="result">
          Test label
        </label>
        <input id="result" />
      </div>
    );

    expect(AOM.result.relations.labelledBy[0]).to.equal(AOM.label);
    expect(AOM.result.accessibleName).to.equal("Test label");
  });

  it("Should not duplicate label when used 'for' and ascendant", () => {
    const { AOM } = sandbox(
      <div>
        <label id="label" htmlFor="result">
          Test label
          <input id="result" />
        </label>
      </div>
    );
    expect(AOM.result.relations.labelledBy.length).to.be.equal(1);
    expect(AOM.result.relations.labelledBy[0]).to.equal(AOM.label);
    expect(AOM.result.accessibleName).to.equal("Test label");
  });

  it("Should understand label for a nested input", () => {
    const { AOM } = sandbox(
      <div>
        <label id="label">
          Nested input label
          <input id="result" />
        </label>
      </div>
    );

    expect(AOM.label.relations.labelOf[0]).to.equal(AOM.result);
    expect(AOM.result.accessibleName).to.equal("Nested input label");
  });

  it("Should understand legend for fieldset", () => {
    const { AOM } = sandbox(
      <div>
        <fieldset id="fieldset">
          <legend id="legend">Nested legend</legend>
          <input id="result" />
        </fieldset>
      </div>
    );

    expect(AOM.legend.relations.labelOf[0]).to.equal(AOM.fieldset);
    expect(AOM.fieldset.accessibleName).to.equal("Nested legend");
  });

  it("Should group inputs to root when not in form", () => {
    const { AOM } = sandbox(
      <div>
        <div>
          <input type="radio" id="radio1" name="group" />
          <input type="radio" id="radio2" name="group" />
          <input type="radio" id="radio3" name="group" />
        </div>
      </div>
    );

    const inputs = AOM.radio3.relations.formContext.descendants.map(x => x.id);
    expect(AOM.radio3.relations.formContext.root).to.equal(null);
    expect(inputs).to.deep.equal(["radio1", "radio2", "radio3"]);
  });

  it("Should understand form input relations", () => {
    const { AOM } = sandbox(
      <form id="result">
        <input type="radio" id="radio1" name="group" />
        <input type="radio" id="radio2" name="group" />
        <input type="radio" id="radio3" name="group" />
      </form>
    );

    const formInputs = AOM.result.relations.formContext.descendants;

    expect(formInputs[0]).to.equal(AOM.radio1);
    expect(formInputs[1]).to.equal(AOM.radio2);
    expect(formInputs[2]).to.equal(AOM.radio3);

    expect(AOM.radio3.relations.formContext.root).to.equal(AOM.result);
  });
});
