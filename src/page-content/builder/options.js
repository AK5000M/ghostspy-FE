import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  InputLabel,
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const Options = () => {
  const { t } = useTranslation();

  const appInstallOptions = [
    { value: "1", label: "TechDroid Suporte" },
    { value: "2", label: "Walpapers App" },
    { value: "3", label: "Temp Mail" },
    { value: "4", label: "Custom" },
    { value: "5", label: "Hidden APP" },
  ];

  const appInstallSize = [
    { value: "5", label: "5 MB" },
    { value: "10", label: "10 MB" },
    { value: "25", label: "25 MB" },
    { value: "50", label: "50 MB" },
  ];

  return (
    <React.Fragment>
      <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            p: 1,
            color: "#564FEE",
          }}
        >
          {t("buildAPKPage.options")}
        </Typography>

        <Grid container spacing={3} sx={{ mt: "3px", color: "white", height: "350px" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Grid display={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <InputLabel id="label" sx={{ color: "white" }}>
                {t("buildAPKPage.afterInstall")}
              </InputLabel>
              <Select fullWidth variant="outlined" sx={{ mr: 2, color: "white", padding: "1px" }}>
                {appInstallOptions.map((item, index) => (
                  <MenuItem value={item.value} key={index}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid display={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <InputLabel id="label" sx={{ color: "white" }}>
                {t("buildAPKPage.appSize")}
              </InputLabel>
              <Select fullWidth variant="outlined" sx={{ mr: 2, color: "white", padding: "1px" }}>
                {appInstallSize.map((item, index) => (
                  <MenuItem value={item.value} key={index}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <FormControlLabel control={<Checkbox />} label={t("buildAPKPage.keepAlive")} />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Options;
