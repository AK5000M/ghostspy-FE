import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Typography, CardMedia, Box, IconButton } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSocketFunctions } from "../../utils/socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import Color from "src/theme/colors";
import { getOfflineKeyLogsList, removeKeyLogsFile } from "src/store/actions/keylog.action";

const OfflineKeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" }); // Tablet between 476px and 1024px
  const [recieveKeyLogs, setRecieveKeyLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null); // For storing the selected file content

  const [state, setState] = useState({
    width: 720,
    height: 720,
    x: 100,
    y: -120,
    minWidth: 360,
    minHeight: 360,
    maxWidth: 720,
    maxHeight: 720,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setState((prevState) => ({
          ...prevState,
          width: window.innerWidth - 20, // Account for padding
          height: window.innerWidth - 20, // Keep it square
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          width: 720,
          height: 720,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setRecieveKeyLogs([]);
    init();
  }, [monitor]);

  const init = async () => {
    try {
      if (device) {
        const response = await getOfflineKeyLogsList({ deviceId: device?.deviceId });

        if (response && Array.isArray(response)) {
          setRecieveKeyLogs(response);
        }
      }
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
    }
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
  };

  // Download Keylogs
  const onKeyLogsDownload = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Remove keylogs file
  const onKeyLogFilesRemove = async (filename) => {
    const deviceId = device?.deviceId;

    const res = await removeKeyLogsFile({
      deviceId,
      filename,
    });

    if (res?.status === 200) {
      toast.success(`${filename} ${t("toast.success.keylog-remove")}`, {
        position: "bottom-center",
        reverseOrder: false,
        duration: 5000,
        style: {
          backgroundColor: Color.background.green_gray01,
          borderRadius: "5px",
          padding: "3px 10px",
          minWidth: "250px",
        },
      });

      // Remove the file from the state
      setRecieveKeyLogs((prevLogs) => prevLogs.filter((log) => log.filename !== filename));

      setSelectedLog(null);
      // Clear the selection if the removed file was selected
      if (selectedLog && selectedLog.filename === filename) {
        setSelectedLog(null);
      }
    } else {
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
    }
  };

  const onCloseModal = () => {
    setRecieveKeyLogs([]);
    setSelectedLog(null);
    onClose(false);
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
      type="offline-keylog"
      onClose={onCloseModal}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          width: "100%",
          height: "100%",
          gap: "10px",
        }}
      >
        {/* Left part: List of TXT files */}
        <Box
          sx={{
            width: !isMobile ? "30%" : "100%",
            height: !isMobile ? "100%" : "50%",
            overflowY: "auto",
            px: 1,
            py: isMobile ? 5 : 1,
            border: `solid 1px ${Color.background.border}`,
          }}
        >
          {recieveKeyLogs.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  color: Color.text.secondary,
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {t("devicesPage.monitors.offline-keylog-empty")}
              </Typography>
            </Box>
          ) : (
            recieveKeyLogs
              .sort((a, b) => {
                const dateA = new Date(a.filename.split(".")[0]); // Extract date from filename
                const dateB = new Date(b.filename.split(".")[0]);
                return dateB - dateA;
              })
              .map((log, index) => (
                <Box
                  key={index}
                  onClick={() => handleLogClick(log)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: "5px",
                    py: "2px",
                    mb: "5px",
                    backgroundColor: log === selectedLog ? Color.background.purple_opacity : "none",
                    "&:hover": {
                      backgroundColor: Color.background.purple_opacity,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      width: "100%",
                      cursor: "default",
                      color: log === selectedLog ? Color.text.primary : Color.text.primary,
                    }}
                  >
                    {log.filename}
                  </Typography>

                  {/* Icons: Download and Remove */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <DownloadIcon
                      onClick={() => onKeyLogsDownload(log.filename, log.content)}
                      sx={{
                        color: Color.background.purple,
                        border: `solid 1px ${Color.background.purple}`,
                        fontSize: "20px",
                        cursor: "pointer",
                        "&:hover": {
                          color: "inherit",
                          backgroundColor: Color.background.purple,
                        },
                      }}
                    />

                    {/* Delete Icon */}
                    <DeleteIcon
                      onClick={() => onKeyLogFilesRemove(log.filename)}
                      sx={{
                        color: Color.background.red_gray01,
                        border: `solid 1px ${Color.background.red_gray01}`,
                        fontSize: "20px",
                        cursor: "pointer",
                        "&:hover": {
                          color: "inherit",
                          backgroundColor: Color.background.red_gray01,
                        },
                      }}
                    />
                  </Box>
                </Box>
              ))
          )}
        </Box>

        {/* Right part: Show content of the selected TXT file */}
        <Box
          sx={{
            width: { md: "70%", xs: "100%" },
            height: "100%",
            p: 2,
            overflowY: "auto",
            backgroundColor: "black",
            border: `solid 1px ${Color.background.border}`,
            color: "white",
            borderRadius: "5px",
          }}
        >
          {selectedLog ? (
            <Box>
              <Typography variant="h6">{selectedLog.filename.replace(".txt", "")}</Typography>
              <pre>{selectedLog.content}</pre>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "14px", color: Color.text.secondary }}>
                {t("devicesPage.monitors.offline-keylog-content-empty")}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MonitorViewer>
  );
};

export default OfflineKeyLogsMonitorViewer;
