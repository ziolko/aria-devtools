import React from "react";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps, borderRadius, useFocusable } from "./utils";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";

const color = "#333377";

const Navigation = styled.div`
  display: grid;
  grid-template-areas:
    ".    column "
    "row  content";

  grid-template-columns: 30px auto auto;
  grid-template-rows: 30px auto;
`;

const Button = styled.div`
  display: inline-block;
  border-radius: ${borderRadius};
  border: 1px dashed #555;
  background: #333;
  cursor: pointer;

  :hover {
    background: #777;
  }
`;

const RowNav = styled.div`
  grid-area: row;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  align-self: flex-start;
`;

const ColNav = styled.div`
  grid-area: column;
`;

const Headers = styled.div`
  display: inline-block;
  margin-left: 15px;

  :hover {
    border-radius: ${borderRadius};
    background: ${color};
  }
`;

const Role = styled.div`
  display: inline-block;
  text-transform: uppercase;
  background: ${color};
  border-radius: ${borderRadius};
  padding: 0 5px;
  margin-right: 10px;
  border: 1px solid transparent;
  opacity: 0.8;
  cursor: pointer;

  ${Headers}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

const TableCell = observer(function TableCell({ node, style = {}, className }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, focusStyle] = useFocusable(node);

  return (
    <div className={className} ref={ref} style={{ ...focusStyle, ...style }}>
      {render(node.children)}
    </div>
  );
});

export default observer(function Table({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  const table = node.relations.tableContext;

  if (!table || !table.rows) {
    return (
      <BlockTemplate role={node.role} header={node.hasCustomAccessibleName ? `${node.accessibleName}` : ""}>
        {render(node.children)}
      </BlockTemplate>
    );
  }

  return (
    <BlockTemplate
      role={node.role}
      header={`${node.hasCustomAccessibleName ? `${node.accessibleName} - ` : ""} ${table.rowCount} row(s), ${
        table.colCount
      } column(s)`}
    >
      <Navigation>
        <ColNav>
          <Button style={{ padding: "2px 15px" }} onClick={() => table.showPreviousColumn()}>
            ⬅
          </Button>
          <span> {table.visibleColumn + 1} </span>
          <Button style={{ padding: "2px 15px" }} onClick={() => table.showNextColumn()}>
            ➡
          </Button>
          <Headers>
            <Role>{table.visibleCell.role ?? "<unknown>"}</Role>
            {table.visibleCell.attributes.headers?.map(x => x.accessibleName).join(", ") || undefined}
          </Headers>
        </ColNav>
        <RowNav>
          <Button style={{ padding: "15px 2px " }} onClick={() => table.showNextRow()}>
            ⬅
          </Button>
          <span> {table.visibleRow + 1} </span>
          <Button style={{ padding: "15px 2px " }} onClick={() => table.showPreviousRow()}>
            ➡
          </Button>
        </RowNav>
        <TableCell style={{ gridArea: "content", border: "1px solid #555", padding: 10 }} node={table.visibleCell} />
      </Navigation>
    </BlockTemplate>
  );
});
