import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

import { useAuth } from "src/hooks/use-auth";
import { useSocketFunctions } from "src/utils/socket";
import { SocketIOPublicEvents } from "src/sections/settings/setting-socket";

import ShareLocationOutlinedIcon from "@mui/icons-material/ShareLocationOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";

import FeaturesGroup from "../../components/featuresGroup";

const LocationMonitorViewer = dynamic(() => import("../../components/monitorViewers/location"), {
  ssr: false,
});
const CallHistoryMonitorViewer = dynamic(
  () => import("../../components/monitorViewers/callhisoty"),
  {
    ssr: false,
  }
);

export const DeviceExtra = ({ device }) => {
  const { t } = useTranslation();
  const user = useAuth();
  const { onSocketCloseMonitor } = useSocketFunctions();

  const [selectedMonitorData, setSelectedMonitorData] = useState(null);
  const [viewerVisibility, setViewerVisibility] = useState({
    "location-monitor": false,
    "call-history-monitor": false,
  });

  const extras = [
    {
      label: SocketIOPublicEvents.location_monitor,
      icon: <ShareLocationOutlinedIcon />,
      title: t("devicesPage.monitors.realTimeLocation"),
    },
    {
      label: SocketIOPublicEvents.call_history_monitor,
      icon: <CallOutlinedIcon />,
      title: t("devicesPage.monitors.callRecord"),
    },
  ];

  useEffect(() => {
    if (device.deviceId) {
      init();
    }
  }, [device.deviceId]);

  // When open Extra, close all socket events
  const init = async () => {
    try {
      await onSocketCloseMonitor("monitor-close", {
        deviceId: device.deviceId,
        type: "all",
      });
    } catch (error) {
      console.error("Initialization Failed", error);
    }
  };

  const onSelectedExtra = async (monitor) => {
    console.log({ monitor });
    try {
      setSelectedMonitorData(monitor);
      setViewerVisibility((prev) => ({
        ...prev,
        [monitor.label]: true,
      }));
    } catch (error) {
      console.error("Monitor Selection Failed", error);
      setLoading(false);
    }
  };

  const handleCloseViewer = async (managerLabel) => {
    try {
      await onSocketCloseMonitor("monitor-close", {
        deviceId: device.deviceId,
        type: managerLabel,
      });
      setViewerVisibility((prev) => ({ ...prev, [managerLabel]: false }));
      if (selectedMonitorData?.label === managerLabel) {
        setSelectedMonitorData(null);
      }
    } catch (error) {
      console.error("Close Viewer Error", error);
    }
  };

  const monitorViewers = {
    "location-monitor": (
      <LocationMonitorViewer
        monitor={selectedMonitorData}
        device={device}
        onClose={() => handleCloseViewer("location-monitor")}
      />
    ),
    "call-history-monitor": (
      <CallHistoryMonitorViewer
        monitor={selectedMonitorData}
        device={device}
        onClose={() => handleCloseViewer("call-history-monitor")}
      />
    ),
  };

  return (
    <React.Fragment>
      <FeaturesGroup current={selectedMonitorData} features={extras} callback={onSelectedExtra} />

      {selectedMonitorData != null && viewerVisibility && monitorViewers[selectedMonitorData.label]}
    </React.Fragment>
  );
};
