import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField, FormControlLabel, Switch } from "@mui/material";
import Color from "src/theme/colors";

const Information = ({ onAppNameChange, onAppUrlChange }) => {
  const { t } = useTranslation();

  // State to track the switch status
  const [showAppUrl, setShowAppUrl] = useState(false);

  const handleAppNameChange = (event) => {
    onAppNameChange(event.target.value);
  };

  const handleAppUrlChange = (event) => {
    onAppUrlChange(event.target.value);
  };

  const handleSwitchChange = (event) => {
    setShowAppUrl(event.target.checked);
    if (event.target.checked == false) {
      onAppUrlChange(null);
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          marginTop: "3px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ width: "100%" }}>
          <TextField
            fullWidth
            label={t("buildAPKPage.appName")}
            name="AppName"
            id="appName"
            required
            onChange={handleAppNameChange}
          />
        </div>

        {/* Switch to show/hide App URL field */}
        <FormControlLabel
          className="app-url-select"
          sx={{ color: Color.text.primary }}
          control={<Switch checked={showAppUrl} onChange={handleSwitchChange} />}
          label={t("buildAPKPage.appUrl")}
        />

        {/* Conditionally render App URL field */}
        {showAppUrl && (
          <div style={{ width: "100%" }}>
            <TextField
              fullWidth
              label={t("buildAPKPage.appUrl")}
              name="AppUrl"
              id="AppUrl"
              onChange={handleAppUrlChange}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Information;
