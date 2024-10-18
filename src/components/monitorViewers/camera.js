import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import CameraToolbar from "./cameraTools";
import Color from "src/theme/colors";

const CameraMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" }); // Tablet between 476px and 1024px

  const [activeCamera, setActiveCamera] = useState("backCamera");
  const [activeQuality, setActiveQuality] = useState(10);
  const [screenCode, setScreenCode] = useState(null);
  const [changeLoading, setChangeLoading] = useState(false);

  useEffect(() => {
    init(activeCamera, activeQuality);
  }, [activeCamera, activeQuality]);

  const onCameraMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId && activeCamera == data?.cameraType) {
      const byteArray = new Uint8Array(data?.base64Image);

      // Convert byte array to base64 string
      const base64String = btoa(String.fromCharCode(...byteArray));

      setScreenCode(base64String);
      setChangeLoading(false);
    } else {
      setScreenCode(null);
    }
  };

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
        x: isTablet ? 0 : 100,
        y: isTablet ? -400 : -120,
        minWidth: 300,
        minHeight: 400,
        maxWidth: 600,
        maxHeight: 700,
      }}
      type="camera"
      onClose={onCloseModal}
    >
      <div
        style={{
          position: "absolute",
          bottom: !isMobile ? "-65px" : "10px",
          left: "0px",
          width: "100%",
          zIndex: "999",
          backgroundColor: Color.background.main,
          border: `solid 1px ${Color.background.purple}`,
          borderRadius: "5px",
        }}
      >
        <CameraToolbar
          screenCode={screenCode}
          activeCamera={activeCamera}
          changeLoading={changeLoading}
          activeQuality={activeQuality}
          onChangeCamera={onChangeCamera}
          onQualityChange={onQualityChange}
        />
      </div>

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
              {screenCode == null ? (
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
                      backgroundColor: Color.background.purple_opacity01,
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
                    transform: activeCamera === "frontCamera" ? "rotate(-90deg)" : "rotate(90deg)",
                  }}
                  alt="Captured Screen"
                />
              )}
            </Grid>
          </React.Fragment>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default CameraMonitorViewer;
