import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Box, Switch, FormControlLabel, Modal, Typography, TextField, Button } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import MenuIcon from "@mui/icons-material/Menu";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import Color from "src/theme/colors";

const ScreenToolbar = ({ visible, device, black, lock }) => {
  const { t } = useTranslation();

  const { onScreenSettingEvent, onScreenControlEvent } = useSocketFunctions();
  const [blackStatus, setBlackStatus] = useState(black != null ? black : device?.blackScreen);
  const [openMessage, setOpenMessage] = useState(false);
  const [lockStatus, setLockStatus] = useState(lock != null ? lock : device?.lockScreen);
  const [privacyText, setPrivacyText] = useState("");

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
      if (privacyText != "") {
        await onScreenSettingEvent(SocketIOPublicEvents.screen_setting_event, {
          type: "blackScreen",
          deviceId: device?.deviceId,
          message: privacyText,
          status: true,
        });
        setBlackStatus(true);
        setOpenMessage(false);
      } else {
        setBlackStatus(false);
        toast.error(t("toast.error.send-text"), {
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

  return (
    <Box
      sx={{
        position: "absolute",
        right: { sm: "-170px", xs: "0px" },
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
          py: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* Toolbar content */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li>
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
                label={t("devicesPage.monitors.black-setting")}
              />
            </li>

            <li>
              <FormControlLabel
                className="back-option"
                sx={{
                  color: Color.text.primary,
                }}
                labelPlacement="start"
                control={
                  <Switch color="primary" checked={lockStatus} onChange={onSwitchLockScreen} />
                }
                label={t("devicesPage.monitors.lock-setting")}
              />
            </li>
          </ul>
        </Box>

        {/* Screen Resolution */}
        <Box>123</Box>
        {/* Screen Control */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { sm: "column", xs: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box onClick={() => onControlScreen("screen-recent-event")}>
            <MenuIcon sx={{ color: Color.text.purple, fontSize: "30px", cursor: "pointer" }} />
          </Box>
          <Box onClick={() => onControlScreen("screen-home-event")}>
            <CheckBoxOutlineBlankIcon
              sx={{ color: Color.text.purple, fontSize: "30px", cursor: "pointer" }}
            />
          </Box>
          <Box onClick={() => onControlScreen("screen-back-event")}>
            <ReplyIcon sx={{ color: Color.text.purple, fontSize: "30px", cursor: "pointer" }} />
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
              onClick={() => setOpenMessage(false)}
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
              onChange={(e) => setPrivacyText(e.target.value)} // Update the state with the inputted text
              required
            />
            <Button
              variant="contained"
              sx={{
                width: "100px",
                gap: "10px",
              }}
              onClick={onPrivacyScreen} // Call the onPrivacyScreen function when OK is clicked
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
