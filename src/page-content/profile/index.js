import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";

import CameraAltIcon from "@mui/icons-material/CameraAlt";

import General from "./general";
import Security from "./secrity";

const AvatarEditor = dynamic(() => import("react-avatar-edit"), { ssr: false });

export const ProfileContent = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    avatar: null,
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  // Load saved user information
  useEffect(() => {
    if (auth.user != null) {
      setFormData({
        avatar: auth.user.avatar || null,
      });
    }
  }, [auth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  // Tab Menus
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Change avatar
  const handleAvatarSave = () => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: preview,
    }));
    setIsAvatarEditorOpen(false);
  };

  const handleAvatarCancel = () => {
    setIsAvatarEditorOpen(false);
  };

  const handleAvatarEdit = () => {
    setIsAvatarEditorOpen(true);
  };

  const handleCrop = (preview) => {
    setPreview(preview);
  };

  const handleClose = () => {
    setPreview(null);
  };

  return (
    <React.Fragment>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          px: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{
              width: "100%",
              color: "white",
              mb: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {t("profilePage.title")}
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              py: 4,
              px: 3,
              mt: 4,
              backgroundColor: "#212631",
              borderRadius: "5px",
              gap: "30px",
            }}
          >
            <Grid item xs={12}>
              <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                  alt="Avatar"
                  src={formData?.avatar || "/assets/avatars/avatar-alcides-antonio.png"}
                  sx={{
                    width: 140,
                    height: 140,
                    border: "solid 2px #564FEE",
                    cursor: "pointer",
                    transition: "border-color 0.3s ease-in-out",
                    "&:hover": {
                      borderColor: "#0f9b0f", // Adjust the hover border color
                    },
                  }}
                  onClick={handleAvatarEdit}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  }}
                  onClick={handleAvatarEdit}
                >
                  <CameraAltIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                centered
              >
                <Tab
                  className="user-info-tab"
                  label={t("profilePage.tabMenu.userInfo")}
                  sx={{ color: "white", fontSize: "16px" }}
                />
                <Tab
                  className="user-info-tab"
                  label={t("profilePage.tabMenu.securityInfo")}
                  sx={{ color: "white", fontSize: "16px" }}
                />
                <Tab
                  className="user-info-tab"
                  label={t("profilePage.tabMenu.detailInfo")}
                  sx={{ color: "white", fontSize: "16px" }}
                />
              </Tabs>
            </Grid>

            {selectedTab === 0 && (
              <React.Fragment>
                <Grid item xs={12} sm={3} lg={3}></Grid>
                <Grid item xs={12} sm={6} lg={6}>
                  <General user={auth?.user} />
                </Grid>
                <Grid item xs={12} sm={3} lg={3}></Grid>
              </React.Fragment>
            )}
            {selectedTab === 1 && (
              <React.Fragment>
                <Grid item xs={12} sm={3} lg={3}></Grid>
                <Grid item xs={12} sm={6} lg={6}>
                  <Security user={auth.user} />
                </Grid>
                <Grid item xs={12} sm={3} lg={3}></Grid>
              </React.Fragment>
            )}
            {selectedTab === 2 && (
              <React.Fragment>
                <Grid item xs={12} sm={3} lg={3}></Grid>
                <Grid item xs={12} sm={6} lg={6}>
                  {/* Detail form elements here */}
                  Detail settings content here.
                </Grid>
                <Grid item xs={12} sm={3} lg={3}></Grid>
              </React.Fragment>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Edit User Avatar */}

      <Dialog open={isAvatarEditorOpen} onClose={handleAvatarCancel} maxWidth="md">
        <DialogTitle sx={{ color: "black" }}>{t("profilePage.editAvatar")}</DialogTitle>
        <DialogContent>
          <AvatarEditor
            width={320}
            height={280}
            onCrop={handleCrop}
            onClose={handleAvatarCancel}
            src={formData.avatar}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className="avatar-cancel-btn"
            onClick={handleAvatarCancel}
            sx={{ color: "black" }}
          >
            {t("profilePage.cancel")}
          </Button>
          <Button className="avatar-save-btn" onClick={handleAvatarSave} sx={{ color: "black" }}>
            {t("profilePage.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
