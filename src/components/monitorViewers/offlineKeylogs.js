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

const OfflineKeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [changeLoading, setChangeLoading] = useState(false);
  const [recieveKeyLogs, setRecieveKeyLogs] = useState([]);

  useEffect(() => {
    setRecieveKeyLogs([]);

    init();
  }, [monitor]);

  const init = async () => {
    setChangeLoading(true);
    try {
      console.log(">>>>>>>>>>");
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

  const onCloseModal = () => {
    setRecieveKeyLogs([]);
    onClose(false);
  };

  return (
    <MonitorViewer
      initialState={{
        width: 800,
        height: 600,
        x: 50,
        y: -120,
        minWidth: 800,
        minHeight: 600,
        maxWidth: 800,
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  Test
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </MonitorViewer>
  );
};

export default OfflineKeyLogsMonitorViewer;
