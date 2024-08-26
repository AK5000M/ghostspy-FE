import React, { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const General = (props) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Load saved user information
  useEffect(() => {
    if (props != null) {
      setFormData({
        username: props.user?.username || "",
        email: props.user?.email || "",
      });
    }
  }, [props]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  return (
    <React.Fragment>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          mb: 2,
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          label={t("home.username")}
          name="username"
          type="text"
          value={formData?.username}
          onChange={handleInputChange}
          inputProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          label={t("home.email")}
          id="email"
          name="email"
          type="text"
          value={formData?.email}
          onChange={handleInputChange}
          inputProps={{ style: { color: "white" } }}
        />
      </Grid>
      <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
        {t("profilePage.save")}
      </Button>
    </React.Fragment>
  );
};

export default General;
