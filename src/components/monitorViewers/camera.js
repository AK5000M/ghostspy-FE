import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import CameraToolbar from "./cameraTools";

const CameraMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [activeCamera, setActiveCamera] = useState("backCamera");
  const [activeQuality, setActiveQuality] = useState(10);
  const [screenCode, setScreenCode] = useState(null);
  const [changeLoading, setChangeLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    init(activeCamera, activeQuality);
  }, [activeCamera, activeQuality]);

  const onCameraMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      console.log("camera byte code", data.base64Image);
      const byteArray = new Uint8Array(data?.base64Image);

      // Convert byte array to base64 string
      const base64String = btoa(String.fromCharCode(...byteArray));

      setScreenCode(base64String);
      setChangeLoading(false);
    }
  };

  console.log("camear screen code", screenCode);

  const init = async (activeCamera, activeQuality) => {
    const currentCamera = activeCamera;
    const currentQuality = activeQuality;
    const deviceId = device?.deviceId;
    try {
      if (deviceId) {
        await onSocketMonitor(SocketIOPublicEvents.camera_monitor, {
          deviceId,
          cameraType: currentCamera,
          qualityType: currentQuality,
        });

        // Receive the screens from server
        socket.on(`camera-shared-${deviceId}`, onCameraMonitorResponse);

        return () => {
          socket.off(`camera-shared-${deviceId}`);
        };
      }
    } catch (error) {
      console.error("Error monitoring device:", error);
    }
  };

  // Change Camera as a Front and Back
  const onChangeCamera = async (camera) => {
    try {
      setChangeLoading(true);
      setActiveCamera(camera);
      setScreenCode(null);
      setChangeLoading(false);
    } catch (error) {
      setChangeLoading(false);
    }
  };

  // Change the quality of camera screen
  const onQualityChange = async (fps) => {
    try {
      setChangeLoading(true);
      setScreenCode(null);
      setActiveQuality(fps);
      setChangeLoading(false);
    } catch (error) {
      setChangeLoading(false);
    }
  };

  // Close the monitor modal
  const onCloseModal = async () => {
    try {
      setScreenCode(null);
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  return (
    <MonitorViewer
      initialState={{
        width: 400,
        height: 500,
        x: 50,
        y: -120,
        minWidth: 300,
        minHeight: 400,
        maxWidth: 600,
        maxHeight: 700,
      }}
      type="camera"
      onClose={onCloseModal}
    >
      {screenCode != null && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            cursor: "pointer",
            width: "88%",
            zIndex: "999",
          }}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Toolbar area inside Rnd */}
          <CameraToolbar
            visible={hovered}
            activeCamera={activeCamera}
            changeLoading={changeLoading}
            activeQuality={activeQuality}
            onChangeCamera={onChangeCamera}
            onQualityChange={onQualityChange}
          />
          <IconButton
            className="modal-close-icon"
            style={{ paddingTop: "0px" }}
            edge="end"
            aria-label="close"
            onMouseEnter={() => setHovered(true)}
          >
            <MenuIcon />
          </IconButton>
        </div>
      )}

      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {screenCode != null && (
            <React.Fragment>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "5px",
                  backgroundColor: "#000",
                }}
              >
                {changeLoading ? (
                  <Grid
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                      color: "white",
                      width: "100%",
                    }}
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#564FEE",
                        width: "30px",
                        height: "30px",
                        borderRadius: "5px",
                      }}
                    >
                      <CircularProgress sx={{ color: "white" }} size={20} />
                    </Grid>
                  </Grid>
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${screenCode}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      transform:
                        activeCamera === "frontCamera" ? "rotate(-90deg)" : "rotate(90deg)",
                    }}
                    alt="Captured Screen"
                  />
                )}
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default CameraMonitorViewer;
