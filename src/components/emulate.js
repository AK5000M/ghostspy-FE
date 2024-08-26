import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  FormControlLabel,
  TextField,
  InputAdornment,
  Switch,
  Typography,
} from "@mui/material";
import AppsOutageIcon from "@mui/icons-material/AppsOutage";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import Battery50Icon from "@mui/icons-material/Battery50";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CopyAllIcon from "@mui/icons-material/CopyAll";

export const EmulateForm = () => {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({
    title: "",
    startMessage: "",
    buttonText: "",
    settingDescription: "",
  });

  const [state, setState] = React.useState({
    checked: true,
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div className="emulate-form">
      <div className="form-header">
        <Typography sx={{ fontSize: "12px" }}>02:00 PM</Typography>
        <Grid>
          <SignalCellularAltIcon />
          <RssFeedIcon />
          <Battery50Icon />
        </Grid>
      </div>
      <div className="inside-form">
        <FormControlLabel
          value="start"
          control={
            <Switch
              checked={state.checked}
              onChange={handleChange}
              color="primary"
              name="checked"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label={t("buildAPKPage.emulateForm.downloadServices")}
          labelPlacement="start"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: "black",
            ml: 1,
            width: "100%",
          }}
        />

        <TextField
          name="title"
          label={t("buildAPKPage.emulateForm.title")}
          value={formValues.title}
          onChange={handleFormChange}
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AppsOutageIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="startMessage"
          label={t("buildAPKPage.emulateForm.startMessages")}
          value={formValues.startMessage}
          onChange={handleFormChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mt: 2 }}
        />

        <TextField
          name="settingDescription"
          label={t("buildAPKPage.emulateForm.settingDescription")}
          value={formValues.settingDescription}
          onChange={handleFormChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mt: 2 }}
        />
        <TextField
          name="buttonText"
          label={t("buildAPKPage.emulateForm.buttonText")}
          value={formValues.buttonText}
          onChange={handleFormChange}
          fullWidth
          sx={{ mt: 2 }}
          className="app-button-edit"
        />
      </div>
      <div className="form-bottom">
        <NavigateBeforeIcon />
        <NavigateNextIcon />
        <CheckBoxOutlineBlankIcon />
        <ImportContactsIcon />
        <CopyAllIcon />
      </div>
    </div>
  );
};
