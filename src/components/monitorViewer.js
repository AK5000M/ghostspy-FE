import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Rnd } from "react-rnd";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Modal } from "@mui/material";
import Color from "src/theme/colors";

const DEFAULT = {
  width: 360,
  height: 720,
  minWidth: 180,
  minHeight: 360,
  maxWidth: 360,
  maxHeight: 720,
  x: 0,
  y: -450,
};

const MonitorViewer = ({ children, initialState, onClose }) => {
  const [state, setState] = useState(initialState);
  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });

  let styles = {
    display: "flex",
    justifyContent: "center",
    borderRadius: "8px",
    border: `solid 1px ${Color.background.purple}`,
    background: Color.background.main,
    padding: "40px 20px 20px 20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: "1000",
  };

  useEffect(() => {
    if (isMobile) {
      setState({ ...state, ...DEFAULT });
    }
  }, [isMobile]);

  const CloseButton = useMemo(
    () => (
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          zIndex: "999",
        }}
      >
        <IconButton
          className="modal-close-icon"
          style={{ paddingTop: "0px" }}
          edge="end"
          onClick={() => onClose(false)}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
    ),
    [onClose]
  );

  return (
    <React.Fragment>
      {!isMobile && (
        <Rnd
          style={styles}
          size={{ width: state.width, height: state.height }}
          position={{ x: state.x, y: state.y }}
          minWidth={state.minWidth}
          minHeight={state.minHeight}
          maxWidth={state.maxWidth}
          maxHeight={state.maxHeight}
          disableDragging={isMobile}
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

          {children}
        </Rnd>
      )}
      {isMobile && (
        <Modal open={isMobile} onClose={() => onClose(false)} style={{ backgroundColor: "#000" }}>
          <React.Fragment>
            {CloseButton}
            {children}
          </React.Fragment>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default MonitorViewer;
