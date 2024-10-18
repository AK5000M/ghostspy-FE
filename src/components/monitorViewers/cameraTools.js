import React from "react";
import { Box, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import CameraFrontOutlinedIcon from "@mui/icons-material/CameraFrontOutlined";
import CameraRearOutlinedIcon from "@mui/icons-material/CameraRearOutlined";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter5Icon from "@mui/icons-material/Filter5";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";

import Color from "src/theme/colors";

const CameraToolbar = ({
  activeCamera,
  activeQuality,
  screenCode,
  onChangeCamera,
  onQualityChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      className={`toolbar visible`}
      sx={{
        display: "contents",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          py: "10px",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={t("devicesPage.monitors.back-camera")}>
            <CameraFrontOutlinedIcon
              onClick={() => onChangeCamera("backCamera")}
              disabled={screenCode == null || activeCamera === "backCamera"}
              sx={{
                cursor: activeCamera === "backCamera" ? "default" : "pointer",
                padding: "4px",
                fontSize: "30px",
                border: `solid 1px ${Color.background.purple}`,
                color: activeCamera === "backCamera" ? Color.text.primary : Color.background.purple,
                backgroundColor:
                  activeCamera === "backCamera" ? Color.background.purple : "initial",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>

          <Tooltip title={t("devicesPage.monitors.front-camera")}>
            <CameraRearOutlinedIcon
              onClick={() => onChangeCamera("frontCamera")}
              disabled={screenCode == null || activeCamera === "frontCamera"}
              sx={{
                cursor: activeCamera === "frontCamera" ? "default" : "pointer",
                padding: "4px",
                fontSize: "30px",
                border: `solid 1px ${Color.background.purple}`,
                color:
                  activeCamera === "frontCamera" ? Color.text.primary : Color.background.purple,
                backgroundColor:
                  activeCamera === "frontCamera" ? Color.background.purple : "initial",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={t("10fps")}>
            <Filter1Icon
              onClick={() => onQualityChange(10)}
              disabled={screenCode == null || activeQuality === 10}
              sx={{
                cursor: activeQuality === 10 ? "default" : "pointer",
                padding: "4px",
                fontSize: "30px",
                border: `solid 1px ${Color.background.purple}`,
                color: activeQuality === 10 ? Color.text.primary : Color.background.purple,
                backgroundColor: activeQuality === 10 ? Color.background.purple : "initial",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>

          <Tooltip title={t("20fps")}>
            <Filter2Icon
              onClick={() => onQualityChange(20)}
              disabled={screenCode == null || activeQuality === 20}
              sx={{
                cursor: activeQuality === 20 ? "default" : "pointer",
                padding: "4px",
                fontSize: "30px",
                border: `solid 1px ${Color.background.purple}`,
                color: activeQuality === 20 ? Color.text.primary : Color.background.purple,
                backgroundColor: activeQuality === 20 ? Color.background.purple : "initial",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>

          <Tooltip title={t("50fps")}>
            <Filter5Icon
              onClick={() => onQualityChange(50)}
              disabled={screenCode == null || activeQuality === 50}
              sx={{
                cursor: activeQuality === 50 ? "default" : "pointer",
                padding: "4px",
                fontSize: "30px",
                border: `solid 1px ${Color.background.purple}`,
                color: activeQuality === 50 ? Color.text.primary : Color.background.purple,
                backgroundColor: activeQuality === 50 ? Color.background.purple : "initial",
                "&:hover": {
                  color: Color.text.primary,
                  backgroundColor: Color.background.purple,
                },
              }}
            />
          </Tooltip>

          <Tooltip title={t("100fps")}>
            <Filter9PlusIcon
              onClick={() => onQualityChange(100)}
              disabled={screenCode == null || activeQuality === 100}
              sx={{
                cursor: activeQuality === 100 ? "default" : "pointer",
                padding: "4px",
                fontSize: "30px",
                border: `solid 1px ${Color.background.purple}`,
                color: activeQuality === 100 ? Color.text.primary : Color.background.purple,
                backgroundColor: activeQuality === 100 ? Color.background.purple : "initial",
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

export default CameraToolbar;
