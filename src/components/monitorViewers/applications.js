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

const ApplicationsMonitorViewer = ({ monitor, device, onClose }) => {
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
  const [recieveAppsHistory, setRecieveAppsHistory] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const onAppsMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data?.deviceId && data?.data.length != 0) {
      setRecieveAppsHistory(data?.callData?.callData);
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
        // Get Apps History
        setChangeLoading(true);
        await onSocketMonitor(SocketIOPublicEvents.application_monitor, {
          deviceId,
        });

        // Receive the App history from server
        socket.on(`application-shared-${deviceId}`, onAppsMonitorResponse);

        return () => {
          socket.off(`application-shared-${deviceId}`);
        };
      }
    } catch (error) {
      console.error("Error monitoring device:", error);
    }
  };

  //   Close the monitor modal
  const onCloseModal = async () => {
    try {
      setRecieveAppsHistory(null);
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
                  {recieveAppsHistory != null &&
                    recieveAppsHistory.map((apps, index) => <>{apps}</>)}
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default ApplicationsMonitorViewer;
