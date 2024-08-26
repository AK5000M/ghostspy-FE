import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, CircularProgress } from "@mui/material";
import { FileCopy as FileCopyIcon } from "@mui/icons-material";
import { CopyToClipboard } from "react-copy-to-clipboard";

const APKButton = ({ apkName, downloading, onDownload, copyUrl }) => {
  const { t } = useTranslation();

  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

  const handleCopyLink = (url) => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };
  return (
    <React.Fragment>
      <Button
        sx={{
          // border: "solid 1px #564FEE",
          color: "#564FEE",
          // borderRadius: "5px",
          width: "140px",
          padding: "2px 5px",
          "&:hover": {
            color: "white",
          },
        }}
        onClick={() => onDownload(apkName)}
        disabled={downloading}
      >
        {downloading ? <CircularProgress size={24} color="inherit" /> : apkName}
      </Button>
      <div style={{ width: "100%", position: "relative", marginTop: "5px" }}>
        <CopyToClipboard text={copyUrl} onCopy={() => handleCopyLink(copyUrl)}>
          <div
            style={{
              cursor: "pointer",
              color: "#564FEE",
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
              "&:hover": {
                color: "white",
              },
            }}
          >
            <FileCopyIcon />
          </div>
        </CopyToClipboard>
        {copyStatus && (
          <div
            style={{
              position: "absolute",
              left: "30px",
              backgroundColor: "#564FEE0f",
              borderRadius: "5px",
            }}
          >
            <p
              style={{
                margin: "0px",
                fontSize: "12px",
                padding: "5px 10px",
                textAlign: "center",
                color: "#cbcbcb",
              }}
            >
              {t("buildAPKPage.copy-url")}
            </p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default APKButton;
