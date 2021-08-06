import styled from "styled-components";
import React from "react";
import {borderRadius, ComponentProps, useFocusable} from "./utils";
import {observer} from "mobx-react";

const white = "#eee";
const black = "#222";

export const SwitchWrapper = styled.span<{ isHovered: boolean; }>`
  padding: 0 3px;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${white}`};
  align-items: center;
`;

const SwitchIcon = styled.span<{ checked: boolean, disabled: boolean }>`
  margin-right: 8px;
  width: 45px;
  height: 14px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  vertical-align: -3px;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 0;
  align-items: center;
  position: relative;
  background: ${props => (props.checked ? white : black)};
  opacity: ${props => props.disabled ? 0.5 : 1};

  ::after {
    position: absolute;
    display: block;
    content: "${props => (props.checked ? "ON" : "OFF")}";
    color: ${props => (props.checked ? black : white)};
    font-weight: ${props => (props.checked ? "bold" : "normal")};
    ${props => (props.checked ? "left: 5px" : "right: 5px")};
  }

  ::before {
    position: absolute;
    display: block;
    left: ${props => (props.checked ? "calc(100% - 10px)" : "1px")};
    transition: all 0.2s ease-in-out;
    content: "";
    background: ${props => (props.checked ? black : white)};
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    border-radius: 10px;
  }
`;

const SwitchLabel = styled.span`
  cursor: pointer;

  :hover {
    background: #555;
  }
`;

export default observer(function Switch({node}: ComponentProps) {
    const [isHovered, setHovered] = React.useState(false);
    const [ref, style] = useFocusable(node);

    return (
        <SwitchWrapper isHovered={isHovered} ref={ref} style={style}>
            <SwitchIcon
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
                checked={node.attributes.ariaChecked === "true"}
                disabled={!!node.attributes.ariaDisabled}
            />
            <SwitchLabel style={{opacity: node.attributes.ariaDisabled ? 0.5 : 1}}>
                {node.attributes.ariaDisabled && "[DISABLED] "}
                {node.accessibleName}
            </SwitchLabel>
        </SwitchWrapper>
    );
});
