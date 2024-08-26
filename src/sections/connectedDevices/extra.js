import React, { useState } from "react";
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
  const [isViewerVisible, setViewerVisible] = useState(false);

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

  const onSelectedExtra = async (monitor) => {
    try {
      setSelectedMonitorData(monitor);
      setViewerVisible(true);
    } catch (error) {
      console.error("Monitor Selection Failed", error);
      setLoading(false);
    }
  };

  const handleCloseViewer = async (event) => {
    try {
      await onSocketCloseMonitor("monitor-close", {
        deviceId: device.deviceId,
      });
      setViewerVisible(event);
    } catch (error) {
      console.error("close error", error);
    }
  };

  const monitorViewers = {
    "location-monitor": (
      <LocationMonitorViewer
        monitor={selectedMonitorData}
        device={device}
        onClose={handleCloseViewer}
      />
    ),
    "call-history-monitor": (
      <CallHistoryMonitorViewer
        monitor={selectedMonitorData}
        device={device}
        onClose={handleCloseViewer}
      />
    ),
  };

  return (
    <React.Fragment>
      <FeaturesGroup current={selectedMonitorData} features={extras} callback={onSelectedExtra} />

      {selectedMonitorData != null && isViewerVisible && monitorViewers[selectedMonitorData.label]}
    </React.Fragment>
  );
};
