import React, { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const Security = (props) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

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
          label={t("home.password")}
          id="oldpassword"
          name="oldpassword"
          type="text"
          value={formData?.oldpassword}
          onChange={handleInputChange}
          inputProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          label={t("home.newPassword")}
          id="newpassword"
          name="newpassword"
          type="text"
          value={formData?.newpassword}
          onChange={handleInputChange}
          inputProps={{ style: { color: "white" } }}
        />
        <TextField
          fullWidth
          label={t("home.confirmpassword")}
          id="confirmpassword"
          name="confirmpassword"
          type="text"
          value={formData?.confirmpassword}
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

export default Security;
