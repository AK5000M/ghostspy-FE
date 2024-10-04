import React from "react";
import { useTranslation } from "react-i18next";

import { Box, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useSocketFunctions } from "../../../utils/socket";
import { SocketIOPublicEvents } from "../../../sections/settings/setting-socket";

import Color from "src/theme/colors";

const ScreenControlPanel = ({ device }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();

  const onRefreshScreen = async () => {
    try {
      const deviceId = device?.deviceId;
      await onSocketMonitor(SocketIOPublicEvents.screen_monitor_refresh, {
        deviceId,
      });
    } catch (error) {
      toast.error(t("toast.error.server-error"), {
        position: "bottom-center",
        reverseOrder: false,
        duration: 5000,
        style: {
          backgroundColor: Color.background.red_gray01,
          borderRadius: "5px",
          padding: "3px 10px",
        },
      });
    }
  };

  const onControlScreenScroll = async (event) => {
    try {
      const deviceId = device?.deviceId;
      await onSocketMonitor(SocketIOPublicEvents.screen_scroll_event, {
        deviceId,
        event,
      });
    } catch (error) {
      toast.error(t("toast.error.server-error"), {
        position: "bottom-center",
        reverseOrder: false,
        duration: 5000,
        style: {
          backgroundColor: Color.background.red_gray01,
          borderRadius: "5px",
          padding: "3px 10px",
        },
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Refresh Button */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Tooltip title={t("devicesPage.monitors.refresh")} placement="top">
          <RefreshIcon
            onClick={onRefreshScreen}
            sx={{
              color: Color.background.purple,
              border: `solid 1px ${Color.background.purple}`,
              fontSize: "30px",
              cursor: "pointer",
              "&:hover": {
                color: Color.text.primary,
                backgroundColor: Color.background.purple,
              },
            }}
          />
        </Tooltip>
      </Box>

      {/* Scroll Controls */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title={t("devicesPage.monitors.up")} placement="top">
            <IconButton
              onClick={() => onControlScreenScroll("up")}
              sx={{ width: "30px", height: "30px" }}
            >
              <KeyboardArrowUpIcon
                sx={{
                  color: Color.background.purple,
                  border: `solid 1px ${Color.background.purple}`,
                  fontSize: "30px",
                  cursor: "pointer",
                  "&:hover": {
                    color: Color.text.primary,
                    backgroundColor: Color.background.purple,
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <Tooltip title={t("devicesPage.monitors.left")} placement="left">
            <KeyboardArrowLeftIcon
              onClick={() => onControlScreenScroll("left")}
              sx={{
                color: Color.background.purple,
                border: `solid 1px ${Color.background.purple}`,
                fontSize: "30px",
                cursor: "pointer",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>

          <Tooltip title={t("devicesPage.monitors.down")} placement="bottom">
            <KeyboardArrowDownIcon
              onClick={() => onControlScreenScroll("down")}
              sx={{
                color: Color.background.purple,
                border: `solid 1px ${Color.background.purple}`,
                fontSize: "30px",
                cursor: "pointer",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>

          <Tooltip title={t("devicesPage.monitors.right")} placement="right">
            <KeyboardArrowRightIcon
              onClick={() => onControlScreenScroll("right")}
              sx={{
                color: Color.background.purple,
                border: `solid 1px ${Color.background.purple}`,
                fontSize: "30px",
                cursor: "pointer",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ScreenControlPanel;
