import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import {observer} from "mobx-react";

import {useStore} from "../../store-context";
import {NodeElement} from "../../AOM/types";

type ResizablePaneState = null | {
    startCursorX: number;
    currentCursorX: number;
}

export function useOpenSidePanel() {
    const store = useStore();
    return useCallback((node: NodeElement | null) => store.openSidePanel(node), [store])
}

export default observer(function SidePanel() {
    const store = useStore();
    const openSidePanel = useOpenSidePanel();
    const [width, setWidth] = useStorage<number>("side-panel-size", 400);
    const [dragState, setDragState] = useState<ResizablePaneState>(null)

    const onMouseDown = (event: React.MouseEvent) => {
        setDragState({startCursorX: event.clientX, currentCursorX: event.clientX});
    }

    const onMouseMove = (event: React.MouseEvent) => {
        setDragState(dragState && {...dragState, currentCursorX: event.clientX});
    }

    const currentWidth = (width ?? 0) + (dragState ? (dragState.startCursorX - dragState.currentCursorX) : 0)
    const onMouseUp = () => {
        if (dragState != null) {
            setWidth(currentWidth)
            setDragState(null);
        }
    };

    if (!store.sidePanelNode) {
        return null;
    }

    return (
        <ActionsBar style={{flexBasis: currentWidth}}>
            <ResizeHandler onMouseDown={onMouseDown}
                           onMouseUp={dragState ? onMouseUp : undefined}
                           onMouseMove={dragState ? onMouseMove : undefined}
                           isActive={!!dragState}/>

            <Header>
                <div>We need your help: {store.sidePanelNode.role}</div>
                <CloseIcon onClick={() => openSidePanel(null)}>x</CloseIcon>
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
});

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
            isCurrent && setValue(result[key] ?? defaultValue)
        });
        return () => {
            isCurrent = false;
        }
    }, [key])

    const updateValue = useCallback((newValue: T) => {
        setValue(newValue)
        // @ts-ignore
        chrome.storage.local.set({[key]: newValue});
    }, [])

    return [value, updateValue];
}
