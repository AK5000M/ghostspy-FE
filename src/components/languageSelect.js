import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Select, MenuItem, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import FlagIcon from "@mui/icons-material/Flag";

const Languages = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || "pr");

  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("selectedLanguage", selectedLanguage);
    setLanguage(selectedLanguage);
  };

  // Sync the language with i18n on component mount if localStorage has a value
  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  return (
    <Box sx={{ display: { md: "flex" }, alignItems: "center" }}>
      <Select
        value={language}
        onChange={handleChange}
        starticon={<LanguageIcon />}
        endicon={<FlagIcon />}
        sx={{ mr: 2, color: "white", padding: "1px" }}
        className="lang-selection"
      >
        <MenuItem value="pr" className="select-menu">
          <img
            src={"../assets/flags/brazil_f.png"}
            alt="Brazil Flag"
            style={{ marginRight: "8px", width: "20px" }}
          />
          PR
        </MenuItem>
        <MenuItem value="en" className="select-menu">
          <img
            src={"../assets/flags/us_f.png"}
            alt="US Flag"
            style={{ marginRight: "8px", width: "20px" }}
          />
          EN
        </MenuItem>
        <MenuItem value="es" className="select-menu">
          <img
            src={"../assets/flags/es_f.png"}
            alt="Spain Flag"
            style={{ marginRight: "8px", width: "20px" }}
          />
          ES
        </MenuItem>
      </Select>
    </Box>
  );
};

export default Languages;
