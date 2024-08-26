import React from "react";
import { Grid, IconButton } from "@mui/material";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import CameraIcon from "@mui/icons-material/Camera";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MessageIcon from "@mui/icons-material/Message";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import AdbIcon from "@mui/icons-material/Adb";
import CollectionsIcon from "@mui/icons-material/Collections";
import {
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";

const MobileIconsBar = () => {
  const iconsData = [
    { icon: <AddToHomeScreenIcon />, color: "#3b5998" }, // Facebook blue
    { icon: <CameraIcon />, color: "#8a3ab9" }, // Instagram purple_gray
    { icon: <SettingsVoiceIcon />, color: "#ff0000" }, // General red
    { icon: <AppRegistrationIcon />, color: "#00aced" }, // Twitter blue
    { icon: <AddLocationAltIcon />, color: "#e1306c" }, // Instagram pink
    { icon: <GraphicEqIcon />, color: "#1db954" }, // Spotify green
    { icon: <SettingsPhoneIcon />, color: "#34b7f1" }, // Messenger blue
    { icon: <FolderOpenIcon />, color: "#ff4500" }, // Reddit orange
    { icon: <ImportContactsIcon />, color: "#25d366" }, // WhatsApp green
    { icon: <AdbIcon />, color: "#0a74da" }, // LinkedIn blue
    { icon: <CollectionsIcon />, color: "#ff2d55" }, // Apple Music red
    { icon: <MessageIcon />, color: "#0088cc" }, // Telegram blue
    { icon: <FaWhatsapp />, color: "#25D366" }, // WhatsApp green
    { icon: <FaInstagram />, color: "#E4405F" }, // Instagram pink
    { icon: <FaTiktok />, color: "#010101" }, // TikTok black
    { icon: <FaFacebook />, color: "#1877F2" }, // Facebook blue
    { icon: <FaTelegram />, color: "#0088CC" }, // Telegram blue
    { icon: <FaTwitter />, color: "#1DA1F2" }, // Twitter blue
  ];

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        padding: "10px",
        gap: "10px",
      }}
    >
      {iconsData.map(({ icon, color }, index) => (
        <Grid
          key={index}
          sx={{
            color,
            fontSize: "32px",
          }}
          className="icon-button"
        >
          {React.cloneElement(icon, { style: { fontSize: "32px" } })}
        </Grid>
      ))}
    </Grid>
  );
};

export default MobileIconsBar;
