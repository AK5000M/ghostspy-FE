import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKETIO_URL);

    socketInstance.on("connect", () => {
      console.log("socketIO connectted");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("socketIO disconnectted");
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("SocketIO error:", error);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  if (!socket) {
    return <div>Loading...</div>; // or render an error message
  }

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
};

export default SocketContextProvider;

export const useSocket = () => {
  return useContext(SocketContext);
};
