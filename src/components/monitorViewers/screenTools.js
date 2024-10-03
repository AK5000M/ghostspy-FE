import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  Box,
  Switch,
  FormControlLabel,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
} from "@mui/material";

import ReplyIcon from "@mui/icons-material/Reply";
import MenuIcon from "@mui/icons-material/Menu";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Color from "src/theme/colors";

const ScreenToolbar = ({ visible, device, black, lock }) => {
  const { t } = useTranslation();

  const { onScreenSettingEvent, onScreenControlEvent, onSocketMonitor } = useSocketFunctions();
  const [blackStatus, setBlackStatus] = useState(black != null ? black : device?.blackScreen);
  const [openMessage, setOpenMessage] = useState(false);
  const [lockStatus, setLockStatus] = useState(lock != null ? lock : device?.lockScreen);
  const [privacyText, setPrivacyText] = useState("");
  const [selectedFps, setSelectedFps] = useState(5);
  const [selectQuality, setSelectQuality] = useState(20);

  // Black Screen Option
  const onSwitchBlackScreen = async (event) => {
    const newStatus = event.target.checked;
    setBlackStatus(newStatus);

    if (newStatus == true) {
      setOpenMessage(true);
      localStorage.setItem("black", newStatus);
    } else {
      setOpenMessage(false);
      await onScreenSettingEvent(SocketIOPublicEvents.screen_setting_event, {
        type: "blackScreen",
        deviceId: device?.deviceId,
        message: "none",
        status: false,
      });
      localStorage.setItem("black", newStatus);
    }
  };

  // Lock Screen Option
  const onSwitchLockScreen = async (event) => {
    const newStatus = event.target.checked;
    setLockStatus(newStatus);

    await onScreenSettingEvent(SocketIOPublicEvents.screen_setting_event, {
      type: "lockScreen",
      deviceId: device?.deviceId,
      status: newStatus,
      message: "lockScreen",
    });

    // localStorage.setItem("lock", newStatus);
  };

  // Handle the Privacy Screen OK button click
  const onPrivacyScreen = async () => {
    try {
      await onScreenSettingEvent(SocketIOPublicEvents.screen_setting_event, {
        type: "blackScreen",
        deviceId: device?.deviceId,
        message: privacyText,
        status: true,
      });
      setBlackStatus(true);
      setOpenMessage(false);
    } catch (error) {
      setBlackStatus(false);
      console.log("send text error", error);
    }
  };

  // Screen Control
  const onControlScreen = async (event) => {
    try {
      await onScreenControlEvent(SocketIOPublicEvents.screen_control_event, {
        deviceId: device?.deviceId,
        event: event,
      });
    } catch (error) {}
  };

  // Close
  const onClosePrivacyText = async () => {
    setOpenMessage(false);
    setBlackStatus(false);
    localStorage.setItem("black", false);
  };

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
    <Box
      sx={{
        position: "absolute",
        right: { sm: "-155px", xs: "0px" },
        top: { sm: "0px", xs: "40px" },
        width: { sm: "140px", xs: "100%" },
        height: { sm: "100%", xs: "250px" },
        zIndex: 999,
      }}
    >
      <Box
        sx={{
          height: "100%",
          background: Color.background.secondary,
          border: `solid 1px ${Color.background.purple}`,
          borderRadius: "5px",
          py: "20px",
          px: "5px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Black and Lock */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: { sm: "block", xs: "flex" },
              justifyContent: "center",
              gap: "100px",
            }}
          >
            <FormControlLabel
              className="back-option"
              sx={{
                color: Color.text.primary,
              }}
              labelPlacement="start"
              control={
                <Switch
                  sx={{
                    "& .MuiSwitch-track": {
                      backgroundColor: "white",
                      opacity: 1,
                    },

                    "& .MuiSwitch-thumb": {
                      backgroundColor: Color.background.purple,
                    },
                  }}
                  checked={blackStatus}
                  onChange={onSwitchBlackScreen}
                />
              }
              label={
                <Typography sx={{ fontSize: "14px" }}>
                  {t("devicesPage.monitors.black-setting")}
                </Typography>
              }
            />

            <FormControlLabel
              className="back-option"
              sx={{
                color: Color.text.primary,
              }}
              labelPlacement="start"
              control={
                <Switch
                  sx={{
                    "& .MuiSwitch-track": {
                      backgroundColor: "white",
                      opacity: 1,
                    },

                    "& .MuiSwitch-thumb": {
                      backgroundColor: Color.background.purple,
                    },
                  }}
                  checked={lockStatus}
                  onChange={onSwitchLockScreen}
                />
              }
              label={
                <Typography sx={{ fontSize: "14px" }}>
                  {t("devicesPage.monitors.lock-setting")}
                </Typography>
              }
            />
          </Box>
          {/* Resolution and FPS */}
          {/* <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { sm: "column", xs: "row" },
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
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
                    <MenuItem className="select-menu" value={5}>
                      5
                    </MenuItem>
                    <MenuItem className="select-menu" value={10}>
                      10
                    </MenuItem>
                    <MenuItem className="select-menu" value={20}>
                      20
                    </MenuItem>
                    <MenuItem className="select-menu" value={40}>
                      40
                    </MenuItem>
                    <MenuItem className="select-menu" value={60}>
                      60
                    </MenuItem>
                    <MenuItem className="select-menu" value={100}>
                      100
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
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
                    <MenuItem className="select-menu" value={20}>
                      20
                    </MenuItem>
                    <MenuItem className="select-menu" value={30}>
                      30
                    </MenuItem>
                    <MenuItem className="select-menu" value={40}>
                      40
                    </MenuItem>
                    <MenuItem className="select-menu" value={50}>
                      50
                    </MenuItem>
                    <MenuItem className="select-menu" value={60}>
                      60
                    </MenuItem>
                    <MenuItem className="select-menu" value={70}>
                      70
                    </MenuItem>
                    <MenuItem className="select-menu" value={80}>
                      80
                    </MenuItem>
                    <MenuItem className="select-menu" value={90}>
                      90
                    </MenuItem>
                    <MenuItem className="select-menu" value={100}>
                      100
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box> */}
        </Box>

        {/* Recent, Home, Back Control */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { sm: "column", xs: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box>
                <Tooltip title={t("devicesPage.monitors.refresh")} placement="top">
                  <RefreshIcon
                    onClick={() => onRefreshScreen()}
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
            <Box
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Tooltip title={t("devicesPage.monitors.up")} placement="top">
                  <IconButton
                    onClick={() => onControlScreenScroll("up")}
                    sx={{
                      width: "30px",
                      height: "30px",
                    }}
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              border: `solid 1px ${Color.background.purple}`,
              px: 1,
              py: 2,
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
        </Box>
      </Box>

      {/* Modal for editing */}
      <Modal open={openMessage}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            border: `solid 1px ${Color.background.border}`,
            backgroundColor: Color.background.main,
            borderRadius: "5px",
            p: 2,
            zIndex: 99999,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
          >
            <Typography component="h2" sx={{ color: Color.text.primary }}>
              {t("devicesPage.monitors.privacy-screen-title")}
            </Typography>
            <CloseOutlinedIcon
              onClick={() => onClosePrivacyText()}
              sx={{
                color: Color.text.primary,
                cursor: "pointer",
                fontSize: "20px",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <TextField
              fullWidth
              label={t("devicesPage.monitors.skeleton-input")}
              value={privacyText}
              onChange={(e) => setPrivacyText(e.target.value)}
              required
            />
            <Button
              variant="contained"
              sx={{
                width: "100px",
                gap: "10px",
              }}
              onClick={onPrivacyScreen}
            >
              <CheckCircleOutlineOutlinedIcon />
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ScreenToolbar;
