import React, { useState } from "react";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import Color from "src/theme/colors";
import UploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";

const AppIcon = ({ onIconChange }) => {
  const { t } = useTranslation();
  const [iconPreview, setIconPreview] = useState(null);
  const [isIconUploaded, setIsIconUploaded] = useState(false);

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
        onIconChange(file);
        setIsIconUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconDelete = () => {
    setIconPreview(null);
    onIconChange(null);
    setIsIconUploaded(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 3,
      }}
    >
      <Typography variant="body1" sx={{ color: Color.text.primary }}>
        {t("buildAPKPage.selectAppIcon")}
      </Typography>
      <div
        style={{
          position: "relative",
          padding: "5px",
          width: "150px",
          maxWidth: "150px",
          minWidth: "150px",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `dotted 1px ${Color.background.border}`,
          borderRadius: "5px",
        }}
      >
        {iconPreview && <img src={iconPreview} alt="Icon Preview" width={100} />}
        <div>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="icon-upload"
            type="file"
            onChange={handleIconUpload}
            key={isIconUploaded ? "icon-uploaded" : "icon-not-uploaded"}
          />
        </div>
        {!isIconUploaded ? (
          <label htmlFor="icon-upload">
            <Tooltip title={t("buildAPKPage.upload")}>
              <IconButton component="span" color="primary">
                <UploadIcon />
              </IconButton>
            </Tooltip>
          </label>
        ) : (
          <div style={{ position: "absolute", bottom: "5px" }}>
            <Tooltip title={t("buildAPKPage.delete")}>
              <IconButton
                component="span"
                sx={{ color: Color.text.red_gray01 }}
                onClick={handleIconDelete}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </Box>
  );
};

export default AppIcon;
