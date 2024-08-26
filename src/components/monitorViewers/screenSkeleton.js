import React, { useEffect, useState, useRef } from "react";
import { Grid, CircularProgress, CardMedia } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDrag } from "react-use-gesture";

import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";

import { useSocket } from "../../hooks/use-socket";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import ScreenToolbar from "./screenTools";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const ScreenMonitorSkeleton = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor, onScreenClickEvent, onScreenDragEvent, onSocketCloseMonitor } =
    useSocketFunctions();
  const { socket } = useSocket();
  const imageRef = useRef(null);

  const [state, setState] = useState({
    width: 360, // Default width
    height: 720, // Default height
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
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const deviceId = device?.deviceId;
    let isMounted = true;

    const monitorDevice = async () => {
      try {
        if (deviceId) {
          setChangeLoading(true);
          await onSocketMonitor(monitor, { deviceId });

          const handleMonitorResponse = (data) => {
            console.log("screen skeleton:", data);

            if (isMounted && monitor === data.type) {
              const base64Image = data.response?.base64Image;
              setScreenCode(base64Image);
              setChangeLoading(false);
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

  const calculatePosition = (clientX, clientY) => {
    const img = imageRef.current;
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

    if (xPosition === 0) {
      xPosition = 0.0;
    } else if (Number.isInteger(xPosition)) {
      xPosition = parseFloat(xPosition.toFixed(6)); // Convert integer to double format
    }

    if (yPosition === 0) {
      yPosition = 0.0;
    } else if (Number.isInteger(yPosition)) {
      yPosition = parseFloat(yPosition.toFixed(6)); // Convert integer to double format
    }

    return { xPosition, yPosition };
  };

  // Handle drag
  const bind = useDrag(async ({ event, memo = { startX: 0, startY: 0 }, movement: [mx, my] }) => {
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

      // Handle the end of the drag event, send positions if needed
      if (positions.length === 0) {
        // Treat as a click event
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
        <ScreenToolbar visible={hovered} device={device} />
        <IconButton
          className="modal-close-icon"
          style={{ paddingTop: "0px" }}
          edge="end"
          aria-label="close"
          onMouseEnter={() => setHovered(true)}
        >
          <MenuIcon />
        </IconButton>
      </div>

      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Your screen monitoring content here */}
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              left: `50px`,
              top: `120px`,
              backgroundColor: "black",
              border: "1px solid #ccc",
            }}
          >
            Skeleton Element
          </div>

          {/* {changeLoading && (
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
          )} */}
          {/* {screenCode != null && !changeLoading && (
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                pb: 1,
                position: "relative", // Added position relative for parent container
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
                  zIndex: 2, // Ensure this grid is on top
                  opacity: 0.5, // Optional: Add opacity to see through the red grid
                  cursor: "default",
                }}
                // onClick={onPositionEvent}
                {...bind()}
              ></Grid>
              <CardMedia
                className="screen-body"
                component="img"
                src={`data:image/png;base64, ${screenCode}`}
                sx={{
                  cursor: "default",
                  width: "100%",
                  height: "100%",
                  borderRadius: "0px",
                  position: "absolute", // Ensure CardMedia is positioned absolutely
                  top: 0,
                  left: 0,
                  zIndex: 1, // Ensure this is below the red grid
                }}
                onLoad={onImageLoad}
                ref={imageRef}
              />
            </Grid>
          )} */}
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default ScreenMonitorSkeleton;
