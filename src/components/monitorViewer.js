import React, { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Rnd } from "react-rnd";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Modal, Box } from "@mui/material";
import Color from "src/theme/colors";

const DEFAULT = {
  x: 0,
  y: -50,
};

const MonitorViewer = ({ children, initialState, onClose }) => {
  const [state, setState] = useState(initialState);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const styles = {
    display: "flex",
    justifyContent: "center",
    borderRadius: "8px",
    border: `solid 1px ${Color.background.purple}`,
    background: Color.background.main,
    padding: "20px 10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: "1000",
  };

  // Prevent drag on close icon
  const preventDrag = (e) => {
    e.stopPropagation();
  };

  const CloseButton = useMemo(
    () => (
      <IconButton
        onMouseDown={preventDrag}
        onTouchStart={preventDrag}
        onClick={() => onClose(false)}
        sx={{
          position: "absolute",
          top: !isMobile ? "-38px" : "5px",
          right: { sm: "1px", xs: "2px" },
          cursor: "pointer",
          pointerEvents: "all",
          zIndex: 99999,
          border: `solid 1px ${Color.background.purple}`,
          backgroundColor: Color.background.main_gray01,
          p: "2px",
        }}
      >
        <CloseIcon className="modal-close-icon" edge="end" aria-label="close" />
      </IconButton>
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
    <>
      {/* Desktop / Non-Mobile Layout */}
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
          disableDragging={isMobile ? true : !isDraggingEnabled}
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

      {/* Mobile / Tablet Modal Layout */}
      {isMobile && (
        <Modal
          open={true}
          onClose={() => onClose(false)} // Trigger the close event
          sx={{ backgroundColor: "#000" }}
        >
          <>
            {CloseButton}
            <Box
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{ width: "100%", height: "100%" }}
            >
              {children}
            </Box>
          </>
        </Modal>
      )}
    </>
  );
};

export default MonitorViewer;
