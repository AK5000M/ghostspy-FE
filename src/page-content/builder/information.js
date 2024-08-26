import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { TextField, InputLabel } from "@mui/material";

import Color from "src/theme/colors";

const Information = ({ onAppNameChange }) => {
  const { t } = useTranslation();

  const handleAppNameChange = (event) => {
    onAppNameChange(event.target.value);
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          marginTop: "3px",
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div style={{ width: "100%" }}>
          <InputLabel id="label" sx={{ color: Color.text.primary, mb: 1 }}>
            {t("buildAPKPage.appName")}
          </InputLabel>
          <TextField
            fullWidth
            label={t("buildAPKPage.appName")}
            name="AppName"
            id="appName"
            required
            onChange={handleAppNameChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Information;
