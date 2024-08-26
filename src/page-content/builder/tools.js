import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Container, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { FileSelector } from "src/components/fileSelect";

const Tools = () => {
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
          {t("buildAPKPage.tools")}
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            mt: "3px",
            color: "white",
            height: "350px",
            display: "flex",
            alignItems: "space-between",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} md={12} sx={{ display: "flex", flexDirection: "column" }}>
            <FormControlLabel control={<Checkbox />} label={t("buildAPKPage.sample")} />
            <FormControlLabel control={<Checkbox />} label={t("buildAPKPage.term")} />
          </Grid>
          <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center" }}>
            <FileSelector />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Tools;
