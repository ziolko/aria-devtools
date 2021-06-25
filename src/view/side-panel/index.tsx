import React, {useCallback, useEffect, useReducer, useState} from "react";
import styled from "styled-components";

interface ResizablePaneState {
    isResizing: boolean;
    width: number;
    startCursorX: number;
    startWidth: number;
}

export default function SidePanel() {
    const [lastOpen, setLastOpen] = useStorage("sponsorship-panel-last-open", 0);
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

    if (lastOpen === undefined || lastOpen > Date.now() - 1000 * 60 * 60 * 24 * 14) {
        return null;
    }

    return (
        <ActionsBar style={{flexBasis: state.width}}>
            <ResizeHandler onMouseDown={onMouseDown}
                           onMouseUp={state.isResizing ? onMouseUp : undefined}
                           onMouseMove={state.isResizing ? onMouseMove : undefined}
                           isActive={state.isResizing}/>

            <Header>
                <div>We need your help!</div>
                <CloseIcon onClick={() => setLastOpen(Date.now())}>x</CloseIcon>
            </Header>
            <p>
                I am proud that ARIA DevTools supports over 1200 people around the
                world in their effort to create websites accessible to everyone.
            </p>
            <p>
                With proper funding it will become an indispensable tool. If your company cares about
                web accessibility and wants to support this open-source project reach out to me at {" "}
                <a href={"mailto:mateusz@roombelt.com"}>mateusz@roombelt.com</a>!
            </p>
            <p>
                Even if you don't want to support ARIA DevTools directly you may like my other project
                {" "}<a href="https://roombelt.com" target="_blank">Roombelt</a>.{" "}
                Check it out and perhaps it will be a great fit for your team!
            </p>
        </ActionsBar>
    );
}

const Header = styled.div`
  justify-content: space-between;
  align-items: center;
  display: flex;
  font-size: 16px;
  padding: 4px 0;

`

const CloseIcon = styled.div`
  font-size: 20px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  opacity: 0.6;
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`

const ResizeHandler = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.isActive ? '-1000px' : '0'};
  width: ${props => props.isActive ? '2000px' : '16px'};
  cursor: col-resize;
  z-index: 1000;
`;

const ActionsBar = styled.div`
  flex: 0 1 auto;
  background: #333;
  padding: 0 10px;
  box-sizing: border-box;
  border-left: 1px solid #555;
  position: relative;

  a {
    color: #aaa;

    :hover {
      color: #fff;
    }
  }
`;

function useStorage<T>(key: string, defaultValue: T): [T | undefined, (value: T) => void] {
    const [value, setValue] = useState<T>();

    useEffect(() => {
        setValue(undefined);
        let isCurrent = true;
        // @ts-ignore
        chrome.storage.local.get([key], (result) => {
            console.log("A", result)
            isCurrent && setValue(result[key] ?? defaultValue)
        });
        return () => {
            isCurrent = false;
        }
    }, [key])

    const updateValue = useCallback((newValue: T) => {
        // @ts-ignore
        chrome.storage.local.set({[key]: newValue}, () => {
            setValue(newValue)
        });
    }, [])

    return [value, updateValue];
}
