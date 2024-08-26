import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Switch, FormControlLabel } from "@mui/material";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import Color from "src/theme/colors";

const ScreenToolbar = ({ visible, device }) => {
  const { t } = useTranslation();
  const { onScreenSettingEvent } = useSocketFunctions();
  const [blackStatus, setBlackStatus] = useState(false);
  const [lockStatus, setLockStatus] = useState(false);

  const onSwitchBlackScreen = async (event) => {
    const newStatus = event.target.checked;
    setBlackStatus(newStatus);

    await onScreenSettingEvent(SocketIOPublicEvents.screen_setting_event, {
      type: "blackScreen",
      deviceId: device?.deviceId,
      status: newStatus,
    });
  };

  const onSwitchLockScreen = async (event) => {
    const newStatus = event.target.checked;
    setLockStatus(newStatus);

    await onScreenSettingEvent(SocketIOPublicEvents.screen_setting_event, {
      type: "lockScreen",
      deviceId: device?.deviceId,
      status: newStatus,
    });
  };

  return (
    <Box
      className={`toolbar ${visible ? "visible" : "hidden"}`}
      sx={{
        position: "absolute",
        left: "10px",
        top: "30px",
        width: "100%",
        height: 100,
        background: Color.background.secondary,
        zIndex: 999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
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
    </Box>
  );
};

export default ScreenToolbar;
