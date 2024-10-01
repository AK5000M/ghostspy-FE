import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Typography, CardMedia, Box, Tooltip } from "@mui/material";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { useSocketFunctions } from "../../utils/socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";
import Color from "src/theme/colors";
import { formatDate, formatDateTime } from "../../utils/common";

import {
  getOfflineKeyLogsList,
  getOfflineKeylogContents,
  downloadOfflineKeylogsFile,
  removeKeyLogsFile,
} from "src/store/actions/keylog.action";

const OfflineKeyLogsMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [changeLoading, setChangeLoading] = useState(false);
  const [keylogsDateList, setKeyLogsDateList] = useState([]);
  const [recieveKeyLogs, setRecieveKeyLogs] = useState([]);
  const [selectedKeylog, setselectedKeylog] = useState(null);

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

  // Load Keylogs List
  const init = async () => {
    setChangeLoading(true);
    try {
      if (device) {
        const response = await getOfflineKeyLogsList({ deviceId: device?.deviceId });
        if (response.status == 200 && response.dates.length > 0) {
          setKeyLogsDateList(response.dates);
        } else {
          console.log("empty keylogs date list");
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
      setChangeLoading(false);
    }
  };

  // Select Keylog Date and Get content of a keylog
  const onSelectKeyLogsDate = async (keylog) => {
    setselectedKeylog(keylog);
    try {
      const deviceId = device?.deviceId;
      const response = await getOfflineKeylogContents({ deviceId, keylog });
      if (response.status == 200) {
        setRecieveKeyLogs(response.keyLogContents);
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

  // Download Keylogs
  const onKeyLogsDownload = async (date) => {
    const deviceId = device?.deviceId;
    const response = await downloadOfflineKeylogsFile({ deviceId, date });
    console.log(response);
    // Handle the blob response for file download
    if (response) {
      const blob = new Blob([response], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `keylogs_${deviceId}_${date}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  // Remove keylogs file
  const onKeyLogFilesRemove = async (date) => {
    const deviceId = device?.deviceId;

    const res = await removeKeyLogsFile({
      deviceId,
      date,
    });

    if (res?.status === 200) {
      toast.success(`${date} ${t("toast.success.keylog-remove")}`, {
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

      // Remove the file from the keylogs date list
      setKeyLogsDateList((prevLogs) => prevLogs.filter((logDate) => logDate !== date));

      if (selectedKeylog === date) {
        setRecieveKeyLogs([]);
        setselectedKeylog(null);
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
    setselectedKeylog(null);
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
            width: { md: "30%", xs: "100%" },
            borderRight: `1px solid ${Color.background.border}`,
            height: { md: "100%", xs: "50%" },
            overflowY: "auto",
            p: 1,
            border: `solid 1px ${Color.background.border}`,
          }}
        >
          {keylogsDateList.length === 0 ? (
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
            keylogsDateList.map((date, index) => (
              <Box
                key={index}
                onClick={() => onSelectKeyLogsDate(date)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "5px",
                  py: "2px",
                  mb: "5px",
                  border: `solid 1px ${
                    date === selectedKeylog ? Color.background.purple : Color.background.main
                  }`,
                  backgroundColor:
                    date === selectedKeylog ? Color.background.purple_opacity : "none",
                  "&:hover": {
                    backgroundColor: Color.background.purple_opacity,
                  },
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    cursor: "default",
                    color: date === selectedKeylog ? Color.text.primary : Color.text.primary,
                  }}
                >
                  {formatDate(date)}
                </Typography>

                {/* Icons: Download and Remove */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <Tooltip title={t("devicesPage.deviceInfo.download")} placement="top">
                    <FileDownloadOutlinedIcon
                      onClick={() => onKeyLogsDownload(date)}
                      sx={{
                        color: Color.text.purple,
                        fontSize: "20px",
                        cursor: "pointer",
                        "&:hover": {
                          color: Color.text.primary,
                        },
                      }}
                    />
                  </Tooltip>

                  {/* Delete Icon */}
                  <Tooltip title={t("devicesPage.deviceInfo.delete")} placement="top">
                    <ClearOutlinedIcon
                      onClick={() => onKeyLogFilesRemove(date)}
                      sx={{
                        color: Color.background.red_gray01,
                        fontSize: "20px",
                        cursor: "pointer",
                        "&:hover": {
                          color: Color.background.red_gray02,
                        },
                      }}
                    />
                  </Tooltip>
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
          {recieveKeyLogs.length > 0 ? (
            <Box>
              <Typography variant="h6">{selectedKeylog}</Typography>
              {recieveKeyLogs.map((logs, index) => (
                <Box
                  key={index}
                  sx={{
                    color: Color.text.secondary,
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Typography component="span" sx={{ color: Color.text.secondary }}>
                    {formatDateTime(logs?.created_at)}
                  </Typography>
                  {"  "}
                  <Typography
                    component="span"
                    sx={{ color: Color.text.purple_light, fontWeight: 600, ml: 1 }}
                  >
                    {logs?.keylogs}
                  </Typography>
                  {"  "}
                  <Typography component="span" sx={{ color: Color.text.secondary, ml: 2 }}>
                    {logs?.keyLogsType}
                  </Typography>
                  {" / "}
                  <Typography component="span" sx={{ color: Color.text.secondary, ml: 2 }}>
                    {logs?.keyevent}
                  </Typography>
                </Box>
              ))}
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
