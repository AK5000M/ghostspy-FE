import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Rnd } from "react-rnd";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Modal, Box } from "@mui/material";
import Color from "src/theme/colors";

// const DEFAULT = {
//   width: 360,
//   height: 720,
//   minWidth: 180,
//   minHeight: 360,
//   maxWidth: 360,
//   maxHeight: 720,
//   x: 0,
//   y: -450,
// };

const MonitorViewer = ({ children, initialState, onClose }) => {
  const [state, setState] = useState(initialState);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });

  let styles = {
    display: "flex",
    justifyContent: "center",
    borderRadius: "8px",
    border: `solid 1px ${Color.background.purple}`,
    background: Color.background.main,
    padding: "20px 10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: "1000",
  };

  // useEffect(() => {
  //   if (isMobile) {
  //     setState({ ...state, ...DEFAULT });
  //   }
  // }, [isMobile]);

  const CloseButton = useMemo(
    () => (
      <div
        style={{
          position: "absolute",
          top: "-27px",
          right: "0px",
          cursor: "pointer",
          pointerEvents: "all",
        }}
      >
        <CloseIcon
          className="modal-close-icon"
          edge="end"
          onClick={() => onClose(false)}
          aria-label="close"
        />
      </div>
    ),
    [onClose]
  );

  const handleMouseEnter = () => {
    setIsDraggingEnabled(false);
  };

  const handleMouseLeave = () => {
    setIsDraggingEnabled(true);
  };

  return (
    <React.Fragment>
      {!isMobile && (
        <Rnd
          lockAspectRatio={true}
          style={styles}
          size={{ width: state.width, height: state.height }}
          position={{ x: state.x, y: state.y }}
          minWidth={state.minWidth}
          minHeight={state.minHeight}
          maxWidth={state.maxWidth}
          maxHeight={state.maxHeight}
          // disableDragging={!isDraggingEnabled}
          disableDragging={isTablet ? true : !isDraggingEnabled} // Disable dragging on tablets
          onDragStop={(e, d) => {
            setState((prevState) => ({ ...prevState, x: d.x, y: d.y }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setState((prevState) => ({
              ...prevState,
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              ...position,
            }));
          }}
        >
          {CloseButton}
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ width: "100%", height: "100%" }}
          >
            {children}
          </Box>
        </Rnd>
      )}
      {isMobile && (
        <Modal open={isMobile} onClose={() => onClose(false)} style={{ backgroundColor: "#000" }}>
          <React.Fragment>
            {CloseButton}
            <Box
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{ width: "100%", height: "100%" }}
            >
              {children}
            </Box>
          </React.Fragment>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default MonitorViewer;
