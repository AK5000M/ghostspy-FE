import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Grid, SvgIcon, Tooltip, Typography } from "@mui/material";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";

import { useAuth } from "src/hooks/use-auth";

import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocketFunctions } from "../../utils/socket";

import WhatsappManager from "../../components/socialManagers/whatsapp";
import InstagramManager from "../../components/socialManagers/instagram";
import FeaturesGroup from "../../components/featuresGroup";
import Color from "src/theme/colors";
// import TiktokManager from "../../components/socialManagers/tiktok";
// import FacebookManager from "../../components/socialManagers/facebook";
// import TwitterManager from "../../components/socialManagers/twitter";
// import TelegramManager from "../../components/socialManagers/telegram";

const socialComponents = {
  [SocketIOPublicEvents.whatsapp]: WhatsappManager,
  [SocketIOPublicEvents.instagram]: InstagramManager,
  // [SocketIOPublicEvents.tiktok]: TiktokManager,
  // [SocketIOPublicEvents.facebook]: FacebookManager,
  // [SocketIOPublicEvents.twitter]: TwitterManager,
  // [SocketIOPublicEvents.telegram]: TelegramManager,
};

export const DeviceSocials = ({ device }) => {
  const { t } = useTranslation();
  const user = useAuth();
  const { onSocketCloseMonitor } = useSocketFunctions();

  const [selectedSocial, setSelectedSocial] = useState(null);
  const [isViewerVisible, setViewerVisible] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await onSocketCloseMonitor("monitor-close", {
      deviceId: device.deviceId,
    });
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

  const onSelectSocial = async (socialData) => {
    if (
      user.user?.subscribe === "basic" &&
      ![SocketIOPublicEvents.whatsapp, SocketIOPublicEvents.instagram].includes(socialData.label)
    ) {
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
    } else {
      try {
        setSelectedSocial(socialData);
        setViewerVisible(true);
      } catch (error) {
        console.error("Social Selection Failed", error);
      }
    }
  };

  const socials = [
    {
      label: SocketIOPublicEvents.whatsapp,
      icon: <FaWhatsapp size={24} color="#25D366" />,
      title: t("devicesPage.socials.whatsapp"),
    },
    {
      label: SocketIOPublicEvents.instagram,
      icon: <FaInstagram size={24} color="#E4405F" />,
      title: t("devicesPage.socials.instagram"),
    },
    {
      label: SocketIOPublicEvents.tiktok,
      icon: <FaTiktok size={24} color="#BBB" />,
      title: t("devicesPage.socials.tiktok"),
    },
    {
      label: SocketIOPublicEvents.facebook,
      icon: <FaFacebook size={24} color="#3b5998" />,
      title: t("devicesPage.socials.facebook"),
    },
    {
      label: SocketIOPublicEvents.twitter,
      icon: <FaXTwitter size={24} color="#1DA1F2" />,
      title: t("devicesPage.socials.twitter"),
    },
    {
      label: SocketIOPublicEvents.telegram,
      icon: <FaTelegram size={24} color="#0088cc" />,
      title: t("devicesPage.socials.telegram"),
    },
  ];

  const SelectedSocialComponent = selectedSocial ? socialComponents[selectedSocial.label] : null;

  return (
    <React.Fragment>
      <FeaturesGroup current={selectedSocial} features={socials} callback={onSelectSocial} />

      {SelectedSocialComponent && isViewerVisible && (
        <SelectedSocialComponent
          social={selectedSocial}
          selectedDevice={device}
          onClose={handleCloseViewer}
        />
      )}
    </React.Fragment>
  );
};
