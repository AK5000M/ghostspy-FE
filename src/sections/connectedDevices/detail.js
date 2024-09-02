import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  Grid,
  SvgIcon,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import PermDeviceInformationIcon from "@mui/icons-material/PermDeviceInformation";
import SystemSecurityUpdateWarningIcon from "@mui/icons-material/SystemSecurityUpdateWarning";
import DnsIcon from "@mui/icons-material/Dns";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";

import { useSocket } from "../../hooks/use-socket";
import { removeDevice } from "../../store/actions/device.action";

import Color from "src/theme/colors";

export const DeviceDetails = ({ selectedDevice, onDeviceRemoved }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();

  const [batteryStatus, setBatteryStatus] = useState(selectedDevice?.batteryStatus);
  const [netStatus, setNetStatus] = useState(selectedDevice?.connectStatus);
  const [openModal, setOpenModal] = useState(false); // Modal state

  useEffect(() => {
    if (selectedDevice) {
      setBatteryStatus(selectedDevice.batteryStatus);
      setNetStatus(selectedDevice.connectStatus);
    }

    const onDeviceInfoResponse = (data) => {
      if (selectedDevice?.deviceId === data.data?.deviceId) {
        setBatteryStatus(data.data?.batteryStatus);
        setNetStatus(data.data?.connectStatus);
      }
    };

    socket.on(`device-information-shared-${selectedDevice?.deviceId}`, onDeviceInfoResponse);

    return () => {
      socket.off(`device-information-shared-${selectedDevice?.deviceId}`, onDeviceInfoResponse);
    };
  }, [selectedDevice, socket]);

  const onRemoveDevice = async (deviceId) => {
    try {
      const result = await removeDevice(deviceId);
      if (result.success) {
        toast.success(t("toast.success.delete-device"), {
          position: "bottom-center",
          reverseOrder: false,
          style: {
            borderRadius: "5px",
            padding: "5px 10px",
            fontSize: "16px",
          },
        });
        onDeviceRemoved();
      } else {
        toast.error(t("toast.success.delete-error"), {
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
      console.log("Remove Device Error", error);
    }
  };

  const handleRemoveClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmRemove = () => {
    onRemoveDevice(selectedDevice.deviceId);
    setOpenModal(false);
  };

  const DeviceDetailItem = ({ icon: Icon, label, value }) => (
    <Grid sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <SvgIcon sx={{ color: Color.text.secondary, fontSize: "20px" }}>
        <Icon />
      </SvgIcon>
      <Typography sx={{ color: Color.text.secondary, fontSize: "14px", fontWeight: "100" }}>
        {label}:{" "}
        <span style={{ color: Color.text.primary, fontWeight: "300", fontSize: "14px" }}>
          {" "}
          {value}
        </span>
      </Typography>
    </Grid>
  );

  const details = [
    {
      icon: SystemSecurityUpdateWarningIcon,
      label: t("devicesPage.deviceInfo.model"),
      value: selectedDevice?.models,
    },
    {
      icon: DnsIcon,
      label: t("devicesPage.deviceInfo.deviceName"),
      value: selectedDevice?.manufacturer,
    },
    {
      icon: MobileFriendlyIcon,
      label: t("devicesPage.deviceInfo.androidVersion"),
      value: selectedDevice?.version,
    },
    {
      icon: PermDeviceInformationIcon,
      label: t("devicesPage.deviceInfo.information"),
      value: selectedDevice?.deviceInfo,
    },
    {
      icon: BatteryChargingFullIcon,
      label: t("devicesPage.deviceInfo.batteryStatus"),
      value: batteryStatus ? `${Math.floor(batteryStatus)}%` : "",
    },
    {
      icon: WifiTetheringIcon,
      label: t("devicesPage.deviceInfo.netStatus"),
      value: netStatus ? `${netStatus}G` : "",
    },
  ];

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxHeight: "500px",
        minHeight: "100px",
        overflowY: "auto",
      }}
    >
      {details.map((detail, index) => (
        <DeviceDetailItem
          key={index}
          icon={detail.icon}
          label={detail.label}
          value={detail.value}
        />
      ))}

      {selectedDevice && (
        <Grid sx={{ mt: 1, borderTop: `solid 2px ${Color.background.border}`, pt: 2 }}>
          <Button
            onClick={handleRemoveClick}
            sx={{
              width: "100%",
              border: `solid 1px ${Color.background.red_gray01}`,
              color: Color.text.red_gray01,
              borderRadius: "5px",
              "&:hover": {
                color: Color.text.primary,
                backgroundColor: Color.background.red_gray01,
              },
            }}
          >
            {t("devicesPage.deviceInfo.removeDevice")}
          </Button>
        </Grid>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            backgroundColor: Color.background.main,
            borderRadius: "8px",
            border: `solid 1px ${Color.background.border}`,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", color: Color.text.primary }}>
          {t("devicesPage.deviceInfo.confirmRemoveTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: Color.text.primary }}>
            {t("devicesPage.deviceInfo.confirmRemoveText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            sx={{ width: "120px", color: Color.text.primary }}
          >
            {t("devicesPage.deviceInfo.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmRemove}
            autoFocus
            sx={{
              background: Color.background.red_gray02,
              width: "120px",
              color: Color.text.primary,
              "&:hover": {
                background: Color.background.red_gray01,
              },
            }}
          >
            {t("devicesPage.deviceInfo.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
