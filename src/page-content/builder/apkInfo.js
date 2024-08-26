import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import APKButton from "./apkButton";

const APKInfo = ({ apkName, imgSrc, downloading, onDownload, copyUrl }) => {
  const arrowStyles = {
    color: "#564FEE",
    animation: "moveDown 1.5s infinite",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        marginBottom: "50px",
      }}
    >
      <img
        src={imgSrc}
        alt={apkName}
        style={{
          width: "60px",
          height: "60px",
        }}
      />
      <KeyboardArrowDownIcon style={arrowStyles} />
      <APKButton
        apkName={apkName}
        downloading={downloading}
        onDownload={onDownload}
        copyUrl={copyUrl}
      />

      <style jsx>{`
        @keyframes moveDown {
          0% {
            transform: translateY(-5px);
          }
          50% {
            transform: translateY(5px);
          }
          100% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default APKInfo;
