import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import MessageIcon from "@mui/icons-material/Message";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CollectionsIcon from "@mui/icons-material/Collections";

import { useAuth } from "src/hooks/use-auth";
import GalleryManager from "../../components/fileManagers/gallery";
import { useSocketFunctions } from "../../utils/socket";
import FeaturesGroup from "../../components/featuresGroup";
import Color from "src/theme/colors";

export const DeviceManagers = ({ device }) => {
  const { t } = useTranslation();
  const user = useAuth();
  const { onSocketCloseMonitor } = useSocketFunctions();

  const [loading, setLoading] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isViewerVisible, setViewerVisible] = useState({});

  useEffect(() => {
    if (device.deviceId) {
      init();
    }
  }, [device.deviceId]);

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

  const onSelectManager = async (manager) => {
    try {
      if (user.user?.subscribe === "basic" && manager.label !== "gallery-manager") {
        toast.error(t("toast.error.upgrade-plan"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
        return;
      }

      setLoading(true);
      setSelectedManager(manager);
      setViewerVisible((prev) => ({ ...prev, [manager.label]: true }));

      // Simulate loading time or perform any async operations here
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Manager Selection Failed", error);
      setLoading(false);
    }
  };

  const handleCloseViewer = async (managerLabel) => {
    try {
      await onSocketCloseMonitor("monitor-close", {
        deviceId: device.deviceId,
        type: managerLabel,
      });
      setViewerVisible((prev) => ({ ...prev, [managerLabel]: false }));
      if (selectedManager?.label === managerLabel) {
        setSelectedManager(null);
      }
    } catch (error) {
      console.error("Close Viewer Error", error);
    }
  };

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
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
      return () => clearTimeout(timeout);
    }
  }, [loading, t]);

  const managers = [
    { label: "gallery-manager", icon: <CollectionsIcon />, title: t("devicesPage.gallery") },
    { label: "sms-manager", icon: <MessageIcon />, title: t("devicesPage.sms") },
    { label: "call-manager", icon: <SettingsPhoneIcon />, title: t("devicesPage.calls") },
    { label: "files-manager", icon: <FolderOpenIcon />, title: t("devicesPage.files") },
    { label: "contracts-manager", icon: <ImportContactsIcon />, title: t("devicesPage.contacts") },
  ];

  return (
    <React.Fragment>
      <FeaturesGroup current={selectedManager} features={managers} callback={onSelectManager} />
      {selectedManager && isViewerVisible[selectedManager.label] && (
        <React.Fragment>
          {selectedManager.label === "gallery-manager" && (
            <GalleryManager
              label={selectedManager.label}
              device={device}
              onClose={() => handleCloseViewer("gallery-manager")}
            />
          )}
          {/* Add other managers here if needed */}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DeviceManagers;
