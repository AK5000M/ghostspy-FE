import React from "react";
import { useSocket } from "../hooks/use-socket";

export const useSocketFunctions = () => {
  const { socket, isConnected } = useSocket();

  // Handle Monitors
  const onSocketMonitor = async (event, data) => {
    try {
      if (socket) {
        console.log("send monitor requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending screen monitor request:", error);
    }
  };

  // Close Monitor Event
  const onSocketCloseMonitor = async (event, data) => {
    try {
      if (socket) {
        console.log("socket close event:", event, data);
        // Monitor Close
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending monitor close request:", error);
    }
  };

  // Device Event
  const onMobileDeviceEvent = async (event, data) => {
    try {
      if (socket) {
        console.log("device event:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending device event request:", error);
    }
  };

  // Screen Click Event
  const onScreenClickEvent = async (event, data) => {
    try {
      if (socket) {
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending device event request:", error);
    }
  };

  // Screen Drag Event
  const onScreenDragEvent = async (event, data) => {
    try {
      if (socket) {
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending device event request:", error);
    }
  };

  // Screen Setting Event
  const onScreenSettingEvent = async (event, data) => {
    try {
      if (socket) {
        console.log("screen setting event:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending device event request:", error);
    }
  };

  // File Managers Event
  const onSocketManager = async (event, data) => {
    try {
      if (socket) {
        console.log("file manager event:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error manager event:", error);
    }
  };

  // Get A Gallery Image
  const onGetGalleryEvent = async (event, data) => {
    try {
      if (socket) {
        console.log("get gallery event:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error get gallery image:", error);
    }
  };

  // Screen  Send Input Text
  const onSendTextEvent = async (event, data) => {
    try {
      if (socket) {
        console.log("send text requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending screen monitor request:", error);
    }
  };

  // Device Format Event
  const onDeviceFormat = async (event, data) => {
    try {
      if (socket) {
        console.log("device format requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error device format request:", error);
    }
  };

  // Screen Main Control
  const onScreenControlEvent = async (event, data) => {
    try {
      if (socket) {
        console.log("screen control requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error screen control request:", error);
    }
  };

  // Uninstall APP
  const onUninstallApp = async (event, data) => {
    try {
      if (socket) {
        console.log("uninstall app requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error uninstall request:", error);
    }
  };

  // Lock or UnLock Device
  const onDeviceLock = async (event, data) => {
    try {
      if (socket) {
        console.log("device lock/unlock requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error sending device lock/unlock request:", error);
    }
  };

  // Show/Hide APP
  const onAppShowHide = async (event, data) => {
    try {
      if (socket) {
        console.log("show/hide app requesting:", event, data);
        // Send into socket server
        socket.emit(event, data);
      } else {
        console.log("Socket not available");
      }
    } catch (error) {
      console.log("Error show/hide app request:", error);
    }
  };

  return {
    onSocketMonitor,
    onMobileDeviceEvent,
    onSocketCloseMonitor,
    onScreenClickEvent,
    onScreenDragEvent,
    onScreenSettingEvent,
    onSocketManager,
    onGetGalleryEvent,
    onSendTextEvent,
    onDeviceFormat,
    onScreenControlEvent,
    onUninstallApp,
    onDeviceLock,
    onAppShowHide,
  };
};
