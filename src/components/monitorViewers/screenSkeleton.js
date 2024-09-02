import React, { useEffect, useState, useRef } from "react";
import { Grid, CircularProgress, Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrag } from "react-use-gesture";

import { useSocket } from "../../hooks/use-socket";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import MonitorViewer from "../monitorViewer";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import Color from "src/theme/colors";

const ScreenMonitorSkeleton = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor, onScreenClickEvent, onScreenDragEvent, onSendTextEvent } =
    useSocketFunctions();
  const { socket } = useSocket();
  const screenRef = useRef(null);

  const [state, setState] = useState({
    width: 360,
    height: 720,
    x: 100,
    y: -120,
    minWidth: 360,
    minHeight: 720,
    maxWidth: 360,
    maxHeight: 720,
  });

  const [skeletonData, setSkeletionData] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState("");
  const [deviceHeight, setDeviceHeight] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [messageOpen, setmessageOpen] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const deviceId = device?.deviceId;
    let isMounted = true;

    const monitorDevice = async () => {
      try {
        if (deviceId) {
          setChangeLoading(true);
          await onSocketMonitor(monitor, { deviceId });

          const handleMonitorResponse = (data) => {
            if (isMounted && monitor === data.type) {
              const deviceW = data.response?.deviceWidth;
              const deviceH = data.response?.deviceHeight;
              const skeletonRes = data.response?.skeletonData;
              console.log("Skeleton Res:", { skeletonRes });
              setDeviceWidth(deviceW);
              setDeviceHeight(deviceH);
              setSkeletionData(skeletonRes);
              setChangeLoading(false);
              setmessageOpen(true);
            }
          };

          socket.on(`screen-skeleton-shared-${deviceId}`, handleMonitorResponse);

          return () => {
            socket.off(`screen-skeleton-shared-${deviceId}`, handleMonitorResponse);
            isMounted = false;
          };
        }
      } catch (error) {
        console.error("Error monitoring device:", error);
      }
    };

    monitorDevice();
  }, [monitor]);

  // Close
  const onCloseModal = async () => {
    try {
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  // Prevent drag on image
  const preventDrag = (e) => {
    e.stopPropagation();
  };

  const handleSkeletonClick = (data) => {
    if (data.type === "edit") {
      setMessage(data);
      setmessageOpen(true);
    }
  };

  // send screen text
  const onSendInputText = async () => {
    try {
      const deviceId = device?.deviceId;

      await onSendTextEvent(SocketIOPublicEvents.screen_send_text_event, {
        deviceId,
        message,
      });
    } catch (error) {
      console.log("send text error", error);
    }
  };

  // X, Y calculation
  const calculatePosition = (clientX, clientY) => {
    const screenElement = screenRef.current;
    if (!screenElement || !screenElement.offsetWidth || !screenElement.offsetHeight) {
      return { xPosition: 0, yPosition: 0 };
    }

    const rect = screenElement.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const renderedWidth = rect.width;
    const renderedHeight = rect.height;

    const intrinsicWidth = 360;
    const intrinsicHeight = (deviceHeight * 360) / deviceWidth;

    const xRate = intrinsicWidth / renderedWidth;
    const yRate = intrinsicHeight / renderedHeight;

    let xPosition = x * xRate;
    let yPosition = y * yRate;

    xPosition = parseFloat(xPosition.toFixed(6));
    yPosition = parseFloat(yPosition.toFixed(6));

    return { xPosition, yPosition };
  };

  // Handle drag
  const bind = useDrag(async ({ event, memo = { startX: 0, startY: 0 } }) => {
    const deviceId = device?.deviceId;

    if (event.type === "pointerdown") {
      setPositions([]);
      setMouseDown(true);
      memo.startX = event.clientX;
      memo.startY = event.clientY;
    } else if (event.type === "pointermove") {
      if (mouseDown) {
        const { xPosition, yPosition } = calculatePosition(event.clientX, event.clientY);
        if (xPosition >= 0 && yPosition >= 0) {
          setPositions((prevPositions) => [...prevPositions, { x: xPosition, y: yPosition }]);
        }
      }
    } else if (event.type === "pointerup") {
      setMouseDown(false);
      if (positions.length === 0) {
        const { xPosition, yPosition } = calculatePosition(event.clientX, event.clientY);

        if (xPosition >= 0 && yPosition >= 0) {
          await onScreenClickEvent(SocketIOPublicEvents.screen_click_event, {
            deviceId,
            xPosition,
            yPosition,
          });
        }
      } else {
        await onScreenDragEvent(SocketIOPublicEvents.screen_drag_event, {
          deviceId,
          positions,
        });
      }
      setPositions([]);
    }
    return memo;
  });

  return (
    <MonitorViewer
      initialState={{
        width: 360,
        height: 720,
        x: 100,
        y: -120,
        minWidth: 360,
        minHeight: 720,
        maxWidth: 360,
        maxHeight: 720,
      }}
      onClose={onCloseModal}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }} ref={screenRef}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
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
                  backgroundColor: Color.background.purple,
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
            onMouseDown={preventDrag}
            onTouchStart={preventDrag}
            sx={{
              cursor: "default",
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              opacity: 0.1,
            }}
            ref={screenRef}
            {...bind()}
          ></Grid>
          {skeletonData.map((data, index) => (
            <Box
              key={index}
              className="screen-body"
              sx={{
                overflowY: "auto",
                width: `${data.width * (320 / deviceWidth)}px`,
                height: `${data.height * (660 / deviceHeight)}px`,
                left: `${data.xposition * (320 / deviceWidth)}px`,
                top: `${data.yposition * (660 / deviceHeight)}px`,
                cursor: data.type === "edit" ? "pointer" : "default",
                backgroundColor: "black",
                border: `1px solid ${Color.background.border}`,
                position: "absolute",
              }}
              onClick={() => handleSkeletonClick(data)}
            >
              <Typography variant="body1" sx={{ color: Color.text.primary, fontSize: "10px" }}>
                {data.text}
              </Typography>
              {data.type == "edit" && (
                <Typography variant="body1" sx={{ color: Color.text.secondary, fontSize: "10px" }}>
                  {data.type}
                </Typography>
              )}
            </Box>
          ))}
        </Grid>
        {/* Open Input Panel */}
        {messageOpen && (
          <Box
            onMouseDown={preventDrag}
            onTouchStart={preventDrag}
            sx={{
              position: "absolute",
              bottom: { md: "-50px", xs: "0px" },
              width: "100%",
              zIndex: 99999,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
              <TextField
                className="screen-message"
                fullWidth
                // label={t("devicesPage.monitors.skeleton-input")}
                value={message?.text || ""}
                onChange={(e) => setMessage({ ...message, text: e.target.value })}
                inputProps={{
                  style: {
                    backgroundColor: Color.background.main,
                    padding: "10px 50px 10px 10px",
                  },
                }}
              />
              <SendOutlinedIcon
                onClick={() => onSendInputText()}
                sx={{
                  backgroundColor: Color.background.main,
                  position: "absolute",
                  right: "1%",
                  color: Color.text.primary,
                  cursor: "pointer",
                  fontSize: "30px",
                  "&:hover": {
                    color: Color.text.secondary,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </div>
    </MonitorViewer>
  );
};

export default ScreenMonitorSkeleton;
