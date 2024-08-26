import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import { InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const FileSelector = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
    event.target.value = null;
  };

  return (
    <React.Fragment>
      <center>
        <label htmlFor="iconapp">
          <input
            style={{ display: "none" }}
            type="file"
            id="iconapp"
            name="iconapp"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <InputAdornment onClick={handleImageClick}>
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ width: "100px", height: "100px", cursor: "pointer", borderRadius: "5px" }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  border: "1px dashed",
                  cursor: "pointer",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  whiteSpace: "pre-wrap",
                }}
              >
                {t("buildAPKPage.selectAppIcon")}
                <AddIcon />
              </div>
            )}
          </InputAdornment>
        </label>
      </center>
    </React.Fragment>
  );
};
