import React from "react";
import Store from "./store";

const StoreContext = React.createContext<Store>(new Store());
export const Provider = StoreContext.Provider;

export const useStore = () => {
  return React.useContext(StoreContext);
};
