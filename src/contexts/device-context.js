import React, { createContext, useContext, useReducer } from "react";

const DeviceContext = createContext();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  NEWDEVICE: "NEWDEVICE",
  FAILED: "FAILED",
};

const initialState = {
  devices: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const devices = action.payload;

    return {
      ...state,
      ...(devices
        ? {
            devices,
          }
        : {
            devices: null,
          }),
    };
  },
  [HANDLERS.NEWDEVICE]: (state, action) => {
    const devices = action.payload;

    return {
      ...state,
      devices: devices,
    };
  },
  [HANDLERS.FAILED]: (state) => {
    return {
      ...state,
      devices: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const DeviceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <DeviceContext.Provider value={{ state, dispatch }}>{children}</DeviceContext.Provider>;
};

export const useDeviceContext = () => useContext(DeviceContext);

export default DeviceContext;
