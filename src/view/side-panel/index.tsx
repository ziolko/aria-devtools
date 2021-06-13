import React, {useReducer} from "react";
import styled from "styled-components";

interface ResizablePaneState {
    isResizing: boolean;
    width: number;
    startCursorX: number;
    startWidth: number;
}

export default function SidePanel() {
    const [state, dispatch] = useReducer(
        (state: ResizablePaneState, action: any) => {
            if (action.type === "start") {
                return {...state, isResizing: true, startCursorX: action.cursorX, startWidth: state.width};
            }
            if (action.type === "update") {
                return {...state, width: state.startWidth + state.startCursorX - action.cursorX};
            }
            if (action.type === "commit") {
                return {...state, isResizing: false};
            }
            if (action.type === "abort") {
                return {...state, isResizing: false, width: state.startWidth};
            }
            return state;
        },
        {width: 400, isResizing: false, startCursorX: 0, startWidth: 0}
    );

    const onMouseDown = (event: React.MouseEvent) => dispatch({type: "start", cursorX: event.clientX})
    const onMouseMove = (event: React.MouseEvent) => {
        dispatch({type: "update", cursorX: event.clientX});
    };
    const onMouseUp = () => dispatch({type: "commit"});

    return (
        <ActionsBar style={{flexBasis: state.width}}>
            <ResizeHandler onMouseDown={onMouseDown}
                           onMouseUp={state.isResizing ? onMouseUp : undefined}
                           onMouseMove={state.isResizing ? onMouseMove : undefined}
                           isActive={state.isResizing}/>
        </ActionsBar>
    );
}

const ResizeHandler = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.isActive ? '-1000px' : '-2px'};
  width: ${props => props.isActive ? '2000px' : '16px'};
  cursor: col-resize;
`;

const ActionsBar = styled.div`
  flex: 0 1 auto;
  background: #333;
  line-height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  border-left: 1px solid #555;
  position: relative;;
`;
