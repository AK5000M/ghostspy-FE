import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import CameraFrontIcon from "@mui/icons-material/CameraFront";
import CameraRearIcon from "@mui/icons-material/CameraRear";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter5Icon from "@mui/icons-material/Filter5";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";

import Color from "src/theme/colors";

const CameraToolbar = ({
  visible,
  activeCamera,
  activeQuality,
  changeLoading,
  onChangeCamera,
  onQualityChange,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      className={`toolbar ${visible ? "visible" : "hidden"}`}
      sx={{
        position: "absolute",
        left: "10px",
        top: "30px",
        height: 100,
        width: "100%",
        background: Color.background.secondary,
        zIndex: 999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <div>
          <Tooltip title={t("devicesPage.monitors.back-camera")}>
            <span>
              <IconButton
                onClick={() => onChangeCamera("backCamera")}
                disabled={changeLoading || activeCamera === "backCamera"}
                sx={{
                  color: activeCamera === "backCamera" ? "#564FEE" : "white",
                  "&:disabled": {
                    color: activeCamera === "backCamera" ? "#564FEE" : "white",
                  },
                }}
              >
                <CameraRearIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={t("devicesPage.monitors.front-camera")}>
            <span>
              <IconButton
                onClick={() => onChangeCamera("frontCamera")}
                disabled={changeLoading || activeCamera === "frontCamera"}
                sx={{
                  color: activeCamera === "frontCamera" ? "#564FEE" : "white",
                  "&:disabled": {
                    color: activeCamera === "frontCamera" ? "#564FEE" : "white",
                  },
                }}
              >
                <CameraFrontIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={t("10fps")}>
            <span>
              <IconButton
                onClick={() => onQualityChange(10)}
                disabled={changeLoading || activeQuality === 10}
                sx={{
                  color: activeQuality === 10 ? "#564FEE" : "white",
                  "&:disabled": {
                    color: activeQuality === 10 ? "#564FEE" : "white",
                  },
                }}
              >
                <Filter1Icon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={t("20fps")}>
            <span>
              <IconButton
                onClick={() => onQualityChange(20)}
                disabled={changeLoading || activeQuality === 20}
                sx={{
                  color: activeQuality === 20 ? "#564FEE" : "white",
                  "&:disabled": {
                    color: activeQuality === 20 ? "#564FEE" : "white",
                  },
                }}
              >
                <Filter2Icon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={t("50fps")}>
            <span>
              <IconButton
                onClick={() => onQualityChange(50)}
                disabled={changeLoading || activeQuality === 50}
                sx={{
                  color: activeQuality === 50 ? "#564FEE" : "white",
                  "&:disabled": {
                    color: activeQuality === 50 ? "#564FEE" : "white",
                  },
                }}
              >
                <Filter5Icon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={t("100fps")}>
            <span>
              <IconButton
                onClick={() => onQualityChange(100)}
                disabled={changeLoading || activeQuality === 100}
                sx={{
                  color: activeQuality === 100 ? "#564FEE" : "white",
                  "&:disabled": {
                    color: activeQuality === 100 ? "#564FEE" : "white",
                  },
                }}
              >
                <Filter9PlusIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </Grid>
    </Box>
  );
};

export default CameraToolbar;
