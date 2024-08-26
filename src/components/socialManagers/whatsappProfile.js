import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Box, Divider } from "@mui/material";

const WhatsappProfileManager = (props) => {
  const { t } = useTranslation();

  // Dummy user profile data
  const userProfile = {
    userName: "John Doe",
    phoneNumber: "+1234567890",
    stateText: "Active",
    followers: 100,
    following: 50,
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
        {userProfile.userName}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" flexDirection="column">
        <Typography variant="body1" gutterBottom sx={{ color: "white" }}>
          <strong>{t("Phone Number")}:</strong> {userProfile.phoneNumber}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: "white" }}>
          <strong>{t("State")}:</strong> {userProfile.stateText}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: "white" }}>
          <strong>{t("Followers")}:</strong> {userProfile.followers}
        </Typography>
        <Typography variant="body1" sx={{ color: "white" }}>
          <strong>{t("Following")}:</strong> {userProfile.following}
        </Typography>
      </Box>
    </Box>
  );
};

export default WhatsappProfileManager;
