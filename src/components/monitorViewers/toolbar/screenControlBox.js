import React from "react";
import { Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ReplyIcon from "@mui/icons-material/Reply";

import { useSocketFunctions } from "../../../utils/socket";
import { SocketIOPublicEvents } from "../../../sections/settings/setting-socket";

import Color from "src/theme/colors";

const ScreenControlBox = ({ device }) => {
  const { onScreenControlEvent } = useSocketFunctions();

  // Screen Control
  const onControlScreen = async (event) => {
    console.log(device, event);
    try {
      await onScreenControlEvent(SocketIOPublicEvents.screen_control_event, {
        deviceId: device?.deviceId,
        event: event,
      });
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        width: { sm: "auto", xs: "200px" },
        display: "flex",
        flexDirection: { sm: "column", xs: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { sm: "10px", xs: "30px" },
        border: `solid 1px ${Color.background.purple}`,
        px: 1,
        py: { sm: 2, xs: "5px" },
      }}
    >
      <MenuIcon
        onClick={() => onControlScreen("screen-recent-event")}
        sx={{
          color: Color.text.purple,
          fontSize: "30px",
          cursor: "pointer",
          "&:hover": {
            color: Color.text.primary,
            backgroundColor: Color.background.purple,
          },
        }}
      />

      <CheckBoxOutlineBlankIcon
        onClick={() => onControlScreen("screen-home-event")}
        sx={{
          color: Color.text.purple,
          fontSize: "30px",
          cursor: "pointer",
          "&:hover": {
            color: Color.text.primary,
            backgroundColor: Color.background.purple,
          },
        }}
      />

      <ReplyIcon
        onClick={() => onControlScreen("screen-back-event")}
        sx={{
          color: Color.text.purple,
          fontSize: "30px",
          cursor: "pointer",
          "&:hover": {
            color: Color.text.primary,
            backgroundColor: Color.background.purple,
          },
        }}
      />
    </Box>
  );
};

export default ScreenControlBox;
