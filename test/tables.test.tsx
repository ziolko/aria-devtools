import * as React from "react";
import { expect } from "chai";
import sandbox from "./sandbox";

describe("Tables", () => {
  it("Should map TABLE, TR and TD", () => {
    const { AOM } = sandbox(
      <table id="table">
        <tr id="row">
          <td id="cell">Cell</td>
        </tr>
      </table>
    );

    expect(AOM.table.role).to.equal("table");
    expect(AOM.row.role).to.equal("row");
    expect(AOM.cell.role).to.equal("cell");
  });

  it("Should recognize columnheaders", () => {
    const { AOM } = sandbox(
      <table id="table">
        <tr id="headersRow">
          <th id="header1">Header 1</th>
          <th id="header2">Header 2</th>
        </tr>
        <tr>
          <td id="cell1">Cell 1</td>
          <td id="cell2">Cell 2</td>
        </tr>
      </table>
    );

    expect(AOM.header1.role).to.equal("columnheader");
    expect(AOM.header2.role).to.equal("columnheader");

    expect(AOM.cell1.attributes.headers).to.deep.equal([AOM.header1]);
    expect(AOM.cell2.attributes.headers).to.deep.equal([AOM.header2]);
  });

  it("Should find headers in grid", () => {
    const { AOM } = sandbox(
      <div role="table" id="table">
        <div role="row">
          <div role="columnheader" id="header1">Header 1</div>
          <div role="columnheader" id="header2">Header 2</div>
        </div>
        <div role="row">
          <div role="cell" id="cell1">Cell 1</div>
          <div role="cell" id="cell2">Cell 2</div>
        </div>
      </div>
    );

    expect(AOM.header1.role).to.equal("columnheader");
    expect(AOM.header2.role).to.equal("columnheader");

    expect(AOM.cell1.attributes.headers).to.deep.equal([AOM.header1]);
    expect(AOM.cell2.attributes.headers).to.deep.equal([AOM.header2]);
  })
});
