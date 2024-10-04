import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";

import { useSocketFunctions } from "../../../utils/socket";
import { SocketIOPublicEvents } from "../../../sections/settings/setting-socket";

import Color from "src/theme/colors";

const ScreenSettingsPanel = ({ device }) => {
  const { t } = useTranslation();
  const { onSocketMonitor } = useSocketFunctions();

  const [selectedFps, setSelectedFps] = useState(5);
  const [selectQuality, setSelectQuality] = useState(20);

  const onSelectFPS = async (event) => {
    setSelectedFps(event.target.value);
    try {
      const deviceId = device?.deviceId;
      const fpsValue = event.target.value;
      await onSocketMonitor(SocketIOPublicEvents.screen_fps_event, {
        deviceId,
        fps: fpsValue,
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

  const onSelectQuality = async (event) => {
    setSelectQuality(event.target.value);
    try {
      const deviceId = device?.deviceId;
      const qualityValue = event.target.value;
      await onSocketMonitor(SocketIOPublicEvents.screen_quality_event, {
        deviceId,
        quality: qualityValue,
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
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { sm: "column", xs: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
      }}
    >
      {/* FPS Selection */}
      <Box>
        <Typography
          sx={{ fontSize: "14px", color: Color.text.primary, textAlign: "center", mb: 1 }}
        >
          {t("devicesPage.monitors.fps")}
        </Typography>
        <Box sx={{ minWidth: 127 }}>
          <FormControl fullWidth>
            <Select
              displayEmpty
              className="screen-selection"
              labelId="fps-select-label"
              id="fps-select"
              value={selectedFps}
              onChange={onSelectFPS}
            >
              {[5, 10, 20, 40, 60, 100].map((fps) => (
                <MenuItem key={fps} className="select-menu" value={fps}>
                  {fps}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Quality Selection */}
      <Box>
        <Typography
          sx={{ fontSize: "14px", color: Color.text.primary, textAlign: "center", mb: 1 }}
        >
          {t("devicesPage.monitors.quality")}
        </Typography>
        <Box sx={{ minWidth: 127 }}>
          <FormControl fullWidth>
            <Select
              displayEmpty
              className="screen-selection"
              labelId="quality-select-label"
              id="quality-select"
              value={selectQuality}
              onChange={onSelectQuality}
            >
              {[20, 30, 40, 50, 60, 70, 80, 90, 100].map((quality) => (
                <MenuItem key={quality} className="select-menu" value={quality}>
                  {quality}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default ScreenSettingsPanel;
