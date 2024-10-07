import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Rnd } from "react-rnd";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Modal, Box } from "@mui/material";
import Color from "src/theme/colors";

const styles = {
  display: "flex",
  justifyContent: "center",
  borderRadius: "8px",
  border: `solid 1px ${Color.background.purple}`,
  background: Color.background.main,
  padding: "20px 10px",
  boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.3)`,
  zIndex: 1000,
};

const MonitorViewer = ({ children, initialState, onClose, type }) => {
  const [state, setState] = useState(initialState);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);

  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" }); // Tablet between 476px and 1024px
  const isDesktop = useMediaQuery({ query: "(min-width: 1025px)" });

  const preventDrag = (e) => {
    e.stopPropagation();
  };

  const CloseButton = useMemo(
    () => (
      <IconButton
        onMouseDown={(e) => {
          preventDrag(e);
          setIsDraggingEnabled(false); // Disable dragging on mouse down
        }}
        onTouchStart={(e) => {
          preventDrag(e);
          setIsDraggingEnabled(false); // Disable dragging on touch start
        }}
        onClick={() => onClose(false)}
        onMouseUp={() => setIsDraggingEnabled(true)} // Re-enable dragging on mouse up
        onTouchEnd={() => setIsDraggingEnabled(true)} // Re-enable dragging on touch end
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
    [onClose, isMobile]
  );

  const handleMouseEnter = () => {
    setIsDraggingEnabled(false);
  };

  const handleMouseLeave = () => {
    setIsDraggingEnabled(true);
  };

  return (
    <>
      {/* Desktop version: RND with drag enabled */}
      {isDesktop && (
        <Rnd
          lockAspectRatio={true}
          style={styles}
          size={{ width: state.width, height: state.height }}
          position={{ x: state.x, y: state.y }}
          minWidth={state.minWidth}
          minHeight={state.minHeight}
          maxWidth={state.maxWidth}
          maxHeight={state.maxHeight}
          disableDragging={!isDraggingEnabled}
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

      {/* Tablet version: RND but with dragging disabled */}
      {isTablet && (
        <Rnd
          lockAspectRatio={true}
          style={styles}
          size={{ width: state.width, height: state.height }}
          position={{
            x:
              type == "screen"
                ? (window.innerWidth - state.width) / 4
                : (window.innerWidth - state.width) / 3,
            y: state.y,
          }}
          minWidth={state.minWidth}
          minHeight={state.minHeight}
          maxWidth={state.maxWidth}
          maxHeight={state.maxHeight}
          disableDragging={true}
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
          <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
            {children}
          </Box>
        </Rnd>
      )}

      {/* Mobile version: Modal with no dragging */}
      {isMobile && (
        <Modal open={true} onClose={() => onClose(false)} sx={{ backgroundColor: "#000" }}>
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
