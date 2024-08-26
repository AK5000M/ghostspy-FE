import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Container,
  Typography,
  Select,
  MenuItem,
  Box,
  Button,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
} from "@mui/material";

import { LinearDeterminate } from "../../components/buildingProgress";
import { EmulateForm } from "../../components/emulate";

const Build = () => {
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [buildingInProgress, setBuildingInProgress] = useState(false);
  const [selectedpermissionOptions, setSelectedpermissionOptions] = useState([]);

  const handleSelectPermissionChange = (event) => {
    setSelectedpermissionOptions(event.target.value);
  };

  const handleSelectPermissionAll = () => {
    setSelectedpermissionOptions(permissionOptions);
  };

  const handleRemoveSelected = () => {
    setSelectedpermissionOptions([]);
  };

  const startBuildingAPK = () => {
    setBuildingInProgress(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setBuildingInProgress(false);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 1000); // Change the interval as needed
  };

  const [selectedOption, setSelectedOption] = useState("option1");
  console.log({ selectedOption });
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const permissionOptions = [
    "Send SMS",
    "Record Calls",
    "Change Wallpaper",
    "Read SMS",
    "Read Call Logs",
    "Read Contacts",
    "Read Accounts",
    "Camera",
    "Microphone",
    "Location",
    "Make Calls",
  ];

  const versions = [
    { value: "v1", label: "V1" },
    { value: "v2", label: "V2" },
    { value: "v3", label: "V3" },
  ];

  return (
    <React.Fragment>
      <Container maxWidth="xl" sx={{ pt: 2, pb: 2 }}>
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
          {t("buildAPKPage.build")}
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            mt: "3px",
            color: "white",
            height: "auto",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedOption == "option2" ? <EmulateForm /> : ""}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "space-between",
            }}
          >
            <InputLabel id="label" sx={{ color: "white", mb: 1 }}>
              {t("buildAPKPage.permissionList")}
            </InputLabel>
            <FormControl fullWidth>
              <Select
                multiple
                value={selectedpermissionOptions}
                onChange={handleSelectPermissionChange}
                fullWidth
                className="permission-select"
              >
                {permissionOptions.map((option) => (
                  <MenuItem key={option} value={option} className="permission-menu">
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={handleSelectPermissionAll} sx={{ mr: 2 }}>
                {t("buildAPKPage.allSelect")}
              </Button>
              <Button variant="contained" onClick={handleRemoveSelected} className="secondary-btn">
                {t("buildAPKPage.remove")}
              </Button>
            </div>

            <Grid container spacing={3} sx={{ color: "white", mt: 2 }}>
              <Grid item xs={12} md={6}>
                <InputLabel id="label1" sx={{ color: "white", mb: 1 }}>
                  {t("buildAPKPage.signtureVersion")}
                </InputLabel>
                <Select fullWidth variant="outlined" sx={{ mr: 2, color: "white", padding: "1px" }}>
                  {versions.map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel id="label2" sx={{ color: "white", mb: 1 }}>
                  {t("buildAPKPage.apkVersion")}
                </InputLabel>
                <Select fullWidth variant="outlined" sx={{ mr: 2, color: "white", padding: "1px" }}>
                  {versions.map((item, index) => (
                    <MenuItem value={item.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel id="label" sx={{ color: "white" }}>
                  {t("buildAPKPage.advancedTitle")}
                </InputLabel>
                <FormControl component="fieldset">
                  <RadioGroup value={selectedOption} onChange={handleOptionChange} row>
                    <FormControlLabel
                      value="option1"
                      control={<Radio />}
                      label={t("buildAPKPage.basic")}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="option2"
                      control={<Radio />}
                      label={t("buildAPKPage.advanced")}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "end" }}>
                <FormControlLabel control={<Checkbox />} label={t("buildAPKPage.protectedApp")} />
              </Grid>
            </Grid>

            <Button variant="contained" onClick={startBuildingAPK} sx={{ mt: 4 }}>
              {t("buildAPKPage.startBuilding")}
            </Button>

            {buildingInProgress && (
              <Box sx={{ mt: 2 }}>
                <LinearDeterminate progress={progress} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Build;
