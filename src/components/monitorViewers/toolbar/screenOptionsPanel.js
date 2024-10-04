import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, FormControlLabel, Switch, Typography, Modal, TextField, Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { useSocketFunctions } from "../../../utils/socket";
import { SocketIOPublicEvents } from "../../../sections/settings/setting-socket";
import Color from "src/theme/colors";

const ScreenOptionsPanel = ({ device, lock, black }) => {
  const { t } = useTranslation();
  const { onScreenSettingEvent } = useSocketFunctions();
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

  // Close
  const onClosePrivacyText = async () => {
    setOpenMessage(false);
    setBlackStatus(false);
    localStorage.setItem("black", false);
  };

  return (
    <>
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
          {/* Black Screen Switch */}
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

          {/* Lock Screen Switch */}
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
    </>
  );
};

export default ScreenOptionsPanel;
