import React from "react";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps, borderRadius } from "./utils";
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

const Button = styled.div<{ disabled: boolean }>`
  display: inline-block;
  border-radius: ${borderRadius};
  border: 1px dashed #555;
  background: #333;
  cursor: pointer;

  :hover {
    background: #777;
  }

  ${props =>
    props.disabled &&
    css`
      color: #777;
      cursor: not-allowed;
      :hover {
        background: #333;
      }
    `};
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

function findNextIndex<T>(list: T[], start: number, step: number, condition: (arg: T) => boolean) {
  for (let i = start; i >= 0 && i < list.length; i += step) {
    if (condition(list[i])) return i;
  }
  return null;
}

export default observer(function Table({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  const [row, setRow] = React.useState(0);
  const [column, setColumn] = React.useState(0);

  const rows = node.relations.tableContext?.rows;
  const rowCount = node.relations.tableContext?.rowCount;
  const colCount = node.relations.tableContext?.colCount;

  if (!rows) {
    return (
      <BlockTemplate role={node.role} header={node.hasCustomAccessibleName ? `${node.accessibleName}` : ""}>
        {render(node.children)}
      </BlockTemplate>
    );
  }

  const cell = rows[row] && rows[row][column];

  const nextRow = findNextIndex(rows, row, 1, row => row[column] && row[column] !== cell);
  const prevRow = findNextIndex(rows, row, -1, row => row[column] && row[column] !== cell);

  const nextColumn = findNextIndex(rows[row], column, 1, x => x && x !== cell);
  const prevColumn = findNextIndex(rows[row], column, -1, x => x && x !== cell);

  return (
    <BlockTemplate
      role={node.role}
      header={`${
        node.hasCustomAccessibleName ? `${node.accessibleName} - ` : ""
      } ${rowCount} row(s), ${colCount} column(s)`}
    >
      <Navigation>
        <ColNav>
          <Button
            disabled={prevColumn == null}
            style={{ padding: "2px 15px" }}
            onClick={() => prevColumn != null && setColumn(prevColumn)}
          >
            ⬅
          </Button>
          <span> {column + 1} </span>
          <Button
            disabled={nextColumn == null}
            style={{ padding: "2px 15px" }}
            onClick={() => nextColumn != null && setColumn(nextColumn)}
          >
            ➡
          </Button>
          <Headers>
            <Role>{rows[row][column].role ?? "<unknown>"}</Role>
            {rows[row][column].attributes.headers?.map(x => x.accessibleName).join(", ") || undefined}
          </Headers>
        </ColNav>
        <RowNav>
          <Button
            disabled={nextRow == null}
            style={{ padding: "15px 2px " }}
            onClick={() => nextRow != null && setRow(nextRow)}
          >
            ⬅
          </Button>
          <span> {row + 1} </span>
          <Button
            disabled={prevRow == null}
            style={{ padding: "15px 2px " }}
            onClick={() => prevRow != null && setRow(prevRow)}
          >
            ➡
          </Button>
        </RowNav>
        <div style={{ gridArea: "content", border: "1px solid #555" }}>
          <div style={{ padding: 10 }}>{render(rows[row][column].children)}</div>
        </div>
      </Navigation>
    </BlockTemplate>
  );
});
