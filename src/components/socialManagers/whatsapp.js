import React, { useState } from "react";
import { Box, IconButton, Typography, Modal, Paper } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { WhatsappChattingManager } from "src/components/socialManagers/whatsappChatting";
import MonitorViewer from "../monitorViewer";

const WhatsappManager = (props) => {
  const { t } = useTranslation();
  const { social, selectedDevice, onClose } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenProfile = () => {
    // setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
          <div style={{ position: "absolute", top: "8px", right: "15px", zIndex: "100" }}>
            <IconButton className="user-info-tab" onClick={onOpenProfile}>
              <AccountCircleIcon />
            </IconButton>
          </div>
          <WhatsappChattingManager social={social} device={selectedDevice} />
        </div>
      </MonitorViewer>

      <Modal open={isModalOpen} onClose={handleClose}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#111927",
            boxShadow: 24,
            pt: 1,
            px: 4,
            pb: 4,
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ color: "#564FEE", fontSize: "18px", flex: 1, textAlign: "left" }}>
              Profile Information
            </Typography>
            <IconButton className="user-info-tab" onClick={handleClose} sx={{ color: "#564FEE" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ mt: 2, color: "white" }}>
            {/* Replace with actual profile data */}
            Name: John Doe
          </Typography>
          <Typography sx={{ mt: 2, color: "white" }}>Email: john.doe@example.com</Typography>
          {/* Add more profile fields as needed */}
        </Paper>
      </Modal>
    </React.Fragment>
  );
};

export default WhatsappManager;
