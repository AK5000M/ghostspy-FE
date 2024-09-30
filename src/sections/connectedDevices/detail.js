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
  Tooltip,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PermDeviceInformationIcon from "@mui/icons-material/PermDeviceInformation";
import SystemSecurityUpdateWarningIcon from "@mui/icons-material/SystemSecurityUpdateWarning";
import DnsIcon from "@mui/icons-material/Dns";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import PhonelinkEraseOutlinedIcon from "@mui/icons-material/PhonelinkEraseOutlined";
import PhonelinkSetupOutlinedIcon from "@mui/icons-material/PhonelinkSetupOutlined";

import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import { useSocket } from "../../hooks/use-socket";
import { removeDevice } from "../../store/actions/device.action";

import Color from "src/theme/colors";

export const DeviceDetails = ({ selectedDevice, onDeviceRemoved }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();

  const { onDeviceFormat, onUninstallApp, onDeviceLock } = useSocketFunctions();

  const [batteryStatus, setBatteryStatus] = useState(selectedDevice?.batteryStatus);
  const [netStatus, setNetStatus] = useState(selectedDevice?.connectStatus);
  const [openModal, setOpenModal] = useState(false);

  const [formatLoading, setFormatLoading] = useState(false);
  const [uninstallLoading, setUninstallLoading] = useState(false);

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

  // Device Format
  const onFormatDevice = async (device) => {
    const deviceId = device?.deviceId;
    setFormatLoading(true);
    try {
      await onDeviceFormat(SocketIOPublicEvents.device_format_event, { deviceId });

      // Format Res from BE
      const handleFormatResponse = (data) => {
        if (deviceId === data.deviceId && device.type == "formatted") {
          // Check if the toast has already been shown
          toast.success(t("toast.success.device-format"), {
            position: "bottom-center",
            reverseOrder: false,
            style: {
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "16px",
            },
          });
          setFormatLoading(false);
        } else {
          setFormatLoading(false);
        }
      };

      socket.on(`device-format-shared-${deviceId}`, handleFormatResponse);
    } catch (error) {
      setFormatLoading(false);
      // Check if the toast has already been shown
      toast.error(t("toast.error.device-format"), {
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

  // Uninstall App
  const onUninstallMobileApp = async (device) => {
    const deviceId = device?.deviceId;
    setUninstallLoading(true);
    try {
      await onUninstallApp(SocketIOPublicEvents.uninstall_app_event, { deviceId });

      // const handleUninstallResponse = (data) => {
      //   if (deviceId === data.deviceId && device.type == "uninstalled") {
      //     // Check if the toast has already been shown
      //     toast.success(t("toast.success.uninstall-app"), {
      //       position: "bottom-center",
      //       reverseOrder: false,
      //       style: {
      //         borderRadius: "5px",
      //         padding: "5px 10px",
      //         fontSize: "16px",
      //       },
      //     });
      //     setUninstallLoading(false);
      //   } else {
      //     setUninstallLoading(false);
      //   }
      // };

      // socket.on(`uninstall-app-shared-${deviceId}`, handleUninstallResponse);
    } catch (error) {
      setUninstallLoading(false);
      toast.error(t("toast.error.unintall-app"), {
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

  // Device Lock/UnLock
  const onLockDevice = async (event) => {
    try {
      const deviceId = selectedDevice?.deviceId;
      await onDeviceLock(SocketIOPublicEvents.device_lock_event, {
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

  const onRemoveClick = () => {
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const onConfirmRemove = () => {
    onRemoveDevice(selectedDevice.deviceId);
    setOpenModal(false);
  };

  const DeviceDetailItem = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
    </Box>
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
        gap: "10px",
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
        <Box sx={{ borderTop: `solid 2px ${Color.background.border}`, pt: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              mb: 2,
            }}
          >
            {/* Device Format,  Lock or UnLock */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title={t("devicesPage.deviceInfo.formatDevice")} placement="top">
                {formatLoading ? (
                  <Box
                    sx={{
                      color: Color.background.purple,
                      border: `solid 1px ${Color.background.purple}`,
                      borderRadius: "5px",
                      cursor: "pointer",
                      py: "2px",
                      px: "5px",
                      height: "33px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size={22} />
                  </Box>
                ) : (
                  <PhonelinkSetupOutlinedIcon
                    variant="outlined"
                    onClick={() => onFormatDevice(selectedDevice)}
                    sx={{
                      color: Color.background.purple,
                      border: `solid 1px ${Color.background.purple}`,
                      borderRadius: "5px",
                      fontSize: "34px",
                      cursor: "pointer",
                      p: "2px",
                      "&:hover": {
                        color: "inherit",
                        backgroundColor: Color.background.purple,
                      },
                    }}
                  />
                )}
              </Tooltip>
              <Tooltip title={t("devicesPage.deviceInfo.lock")} placement="top">
                <LockOutlinedIcon
                  onClick={() => onLockDevice("lock")}
                  sx={{
                    color: Color.background.purple,
                    border: `solid 1px ${Color.background.purple}`,
                    borderRadius: "5px",
                    fontSize: "34px",
                    cursor: "pointer",
                    p: "2px",
                    "&:hover": {
                      color: "inherit",
                      backgroundColor: Color.background.purple,
                    },
                  }}
                />
              </Tooltip>
              <Tooltip title={t("devicesPage.deviceInfo.unlock")} placement="top">
                <LockOpenOutlinedIcon
                  onClick={() => onLockDevice("unlock")}
                  sx={{
                    color: Color.background.purple,
                    border: `solid 1px ${Color.background.purple}`,
                    borderRadius: "5px",
                    fontSize: "34px",
                    cursor: "pointer",
                    p: "2px",
                    "&:hover": {
                      color: "inherit",
                      backgroundColor: Color.background.purple,
                    },
                  }}
                />
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title={t("devicesPage.deviceInfo.removeDevice")} placement="top">
                <PhonelinkEraseOutlinedIcon
                  onClick={onRemoveClick}
                  sx={{
                    border: `solid 1px ${Color.background.red_gray01}`,
                    color: Color.text.red_gray01,
                    borderRadius: "5px",
                    fontSize: "34px",
                    cursor: "pointer",
                    p: "2px",
                    "&:hover": {
                      color: "inherit",
                      backgroundColor: Color.background.red_gray01,
                    },
                  }}
                />
              </Tooltip>

              <Tooltip title={t("devicesPage.deviceInfo.uninstall-App")} placement="top">
                <DeleteForeverOutlinedIcon
                  variant="outlined"
                  onClick={() => onUninstallMobileApp(selectedDevice)}
                  sx={{
                    color: Color.background.yellow_gray01,
                    border: `solid 1px ${Color.background.yellow_gray01}`,
                    borderRadius: "5px",
                    fontSize: "34px",
                    cursor: "pointer",
                    p: "2px",
                    "&:hover": {
                      color: "inherit",
                      backgroundColor: Color.background.yellow_gray01,
                    },
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}

      <Dialog
        open={openModal}
        onClose={onCloseModal}
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
          <DialogContentText sx={{ color: Color.text.secondary }}>
            {t("devicesPage.deviceInfo.confirmRemoveText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={onCloseModal}
            sx={{ width: "120px", color: Color.text.primary }}
          >
            {t("devicesPage.deviceInfo.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmRemove}
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
