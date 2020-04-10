import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { createPopper } from "@popperjs/core";

const PopupContext = React.createContext(null);

const PopupDiv = styled.div`
  z-index: 16777271;
  
  //&:hover {
  //  outline: 2px solid yellow;
  //}

  //&:not(:last-child) {
  //  opacity: 0;
  //  pointer-events: none;
  //}

  &[data-popper-placement^="top"] {
    [data-popper-arrow] {
      height: 10px;
      width: 10px;
      bottom: 5px;
    }

    [data-popper-arrow]::before {
      content: "";
      height: 10px;
      width: 10px;
      background: black;
      display: block;
      transform: rotateZ(45deg);
      position: absolute;
    }

    [data-popper-arrow]::after {
      position: absolute;
      content: "";
      height: 10px;
      width: 10px;
      background: white;
      display: block;
      transform: translateY(-1px) rotateZ(45deg);
    }

    [data-popper-content] {
      margin-bottom: 10px;
    }
  }

  &[data-popper-placement^="bottom"] {
    [data-popper-arrow] {
      top: 0;
    }

    [data-popper-content] {
      margin-top: 10px;
    }
  }

  [data-popper-arrow] {
  }

  [data-popper-content] {
    background: white;
    border: 1px solid black;
    border-radius: 4px;
    color: black;
  }
`;

export const PopupContainer = ({ children }) => {
  const divRef = React.useRef(null);

  return (
    <PopupContext.Provider value={divRef}>
      {children}
      <div data-poup-context={true} ref={divRef} />
    </PopupContext.Provider>
  );
};

export const Popup = ({
  onMouseOver,
  onMouseLeave,
  children,
  targetElementRef
}) => {
  const popupContainer = React.useContext(PopupContext);
  const popupWrapper = React.useRef(null);

  React.useEffect(() => {
    const instance = createPopper(
      targetElementRef.current,
      popupWrapper.current,
      {
        placement: "auto",
        modifiers: [
          {
            name: "arrow",
            options: {
              padding: 30
            }
          }
        ]
      }
    );
    return () => {
      instance.destroy();
    };
  }, [targetElementRef.current, popupContainer.current]);

  if (!popupContainer.current) return null;
  return ReactDOM.createPortal(
    <PopupDiv
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      ref={popupWrapper}
    >
      <div data-popper-arrow={true} />
      <div data-popper-content={true}>{children}</div>
    </PopupDiv>,
    popupContainer.current
  );
};
