import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Grid, Typography, CircularProgress } from "@mui/material";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VoicemailIcon from "@mui/icons-material/Voicemail";
import BlockIcon from "@mui/icons-material/Block";
import UnknownIcon from "@mui/icons-material/HelpOutline";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const style = {
  display: "flex",
  justifyContent: "center",
  borderRadius: "8px",
  border: "solid 1px #564FEE",
  background: "#212631",
  padding: "20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
};

const CallHistoryMonitorViewer = ({ monitor, device, onClose }) => {
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
  const [recieveCallHistory, setRecieveCallHistory] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const onCallSMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.callData?.deviceId && data.callData.callData.length != 0) {
      setRecieveCallHistory(data?.callData?.callData);
      setChangeLoading(false);
    } else {
      toast.error(t("toast.error.empty-data"), {
        position: "bottom-right",
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

  const init = async () => {
    const deviceId = device?.deviceId;

    try {
      if (deviceId) {
        // Get Calls History
        setChangeLoading(true);
        await onSocketMonitor(SocketIOPublicEvents.call_history_monitor, {
          deviceId,
        });

        // Receive the call history from server
        socket.on(`call-history-shared-${deviceId}`, onCallSMonitorResponse);

        return () => {
          socket.off(`call-history-shared-${deviceId}`);
        };
      }
    } catch (error) {
      console.error("Error monitoring device:", error);
    }
  };

  //   Close the monitor modal
  const onCloseModal = async () => {
    try {
      setRecieveCallHistory(null);
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  //
  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Call status icons
  const getCallIcon = (type) => {
    switch (type) {
      case "Incoming":
        return <CallReceivedIcon sx={{ fontSize: "16px", color: "#564FEE" }} />;
      case "Outgoing":
        return <CallMadeIcon sx={{ fontSize: "16px", color: "blue" }} />;
      case "Missed":
        return <CallMissedIcon sx={{ fontSize: "16px", color: "orange" }} />;
      case "Rejected":
        return <CallEndIcon sx={{ fontSize: "16px", color: "red" }} />;
      case "Voicemail":
        return <VoicemailIcon sx={{ fontSize: "16px", color: "purple_gray" }} />;
      case "Blocked":
        return <BlockIcon sx={{ fontSize: "16px", color: "black" }} />;
      case "Answered Externally":
        return <CallReceivedIcon sx={{ fontSize: "16px", color: "grey" }} />;
      case "Unknown":
        return <UnknownIcon sx={{ fontSize: "16px", color: "grey" }} />;
      default:
        return null;
    }
  };

  // Call History Items
  const CallHistoryItem = ({ number, type, duration, date }) => (
    <Grid
      sx={{
        width: "100%",
        p: "10px",
        borderBottom: `solid 1px ${Color.background.border}`,
        display: "grid",
        gridTemplateColumns: "30% 10% 20% 30%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Grid>
        <Typography component="h2" sx={{ color: "white" }}>
          {number}
        </Typography>
      </Grid>
      <Grid>
        <Typography component="h2">{getCallIcon(type)}</Typography>
      </Grid>
      <Grid>
        <Typography component="h2" sx={{ color: "white" }}>
          {formatDuration(duration)}
        </Typography>
      </Grid>
      <Grid>
        <Typography component="h2" sx={{ fontSize: "14px", color: "#564FEE" }}>
          {date}
        </Typography>
      </Grid>
    </Grid>
  );

  // Call History Header
  const CallHistoryHeader = () => (
    <Grid
      sx={{
        width: "100%",
        p: "10px",
        display: "grid",
        gridTemplateColumns: "30% 10% 20% 30%",
        justifyContent: "space-between",
        borderBottom: "solid 1px rgb(28, 37, 54)",
        backgroundColor: Color.background.purple,
      }}
    >
      <Grid>
        <Typography
          component="h2"
          sx={{ color: Color.text.primary, fontFamily: "Bebas Neue, sans-serif" }}
        >
          {t("devicesPage.monitors.call-number")}
        </Typography>
      </Grid>
      <Grid>
        <Typography
          component="h2"
          sx={{ color: Color.text.primary, fontFamily: "Bebas Neue, sans-serif" }}
        >
          {t("devicesPage.monitors.call-type")}
        </Typography>
      </Grid>
      <Grid>
        <Typography
          component="h2"
          sx={{ color: Color.text.primary, fontFamily: "Bebas Neue, sans-serif" }}
        >
          {t("devicesPage.monitors.call-duration")}
        </Typography>
      </Grid>
      <Grid>
        <Typography
          component="h2"
          sx={{ color: Color.text.primary, fontFamily: "Bebas Neue, sans-serif" }}
        >
          {t("devicesPage.monitors.call-date")}
        </Typography>
      </Grid>
    </Grid>
  );

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
      type="history"
      onClose={onCloseModal}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            position: "relative",
            width: "100%",
            height: "98%",
          }}
        >
          <React.Fragment>
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
                  overflowY: "auto",
                  cursor: "default",
                }}
              >
                <Grid sx={{ gap: "5px", alignItems: "center" }} container>
                  <CallHistoryHeader />
                  {recieveCallHistory != null &&
                    recieveCallHistory.map((call, index) => (
                      <CallHistoryItem
                        key={index}
                        number={call.number}
                        type={call.type}
                        duration={call.duration}
                        date={call.date}
                      />
                    ))}
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default CallHistoryMonitorViewer;
