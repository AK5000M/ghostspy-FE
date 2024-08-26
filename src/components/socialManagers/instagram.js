import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Box, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import MonitorViewer from "../monitorViewer";

const InstagramChattingManager = dynamic(
  () => import("../../components/socialManagers/instagramChatting"),
  {
    ssr: false,
  }
);

const InstagramManager = (props) => {
  const { t } = useTranslation();
  const { social, selectedDevice, onClose } = props;

  const onOpenProfile = () => {
    // Handle profile icon click (e.g., open profile page or modal)
    // console.log("Profile icon clicked");
  };

  // Close the monitor modal
  const onCloseModal = async () => {
    try {
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  return (
    <React.Fragment>
      <MonitorViewer
        initialState={{
          width: 360,
          height: 720,
          x: 100,
          y: -120,
          minWidth: 180,
          minHeight: 360,
          maxWidth: 360,
          maxHeight: 720,
        }}
        onClose={onCloseModal}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "15px",
              zIndex: "100",
              marginTop: "20px",
            }}
          >
            <IconButton className="user-info-tab" onClick={onOpenProfile}>
              <AccountCircleIcon />
            </IconButton>
          </div>
          <InstagramChattingManager social={social} device={selectedDevice} />
        </div>
      </MonitorViewer>
    </React.Fragment>
  );
};

export default InstagramManager;
