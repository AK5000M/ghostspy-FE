import React from "react";
import { useTranslation } from "react-i18next";
import { SvgIcon, Typography, Tooltip, Box } from "@mui/material";
import Color from "../theme/colors";

const FeaturesGroup = ({ current, features, callback }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginLeft: 0,
        marginTop: "16px",
      }}
    >
      {features?.map((feature, index) => (
        <Tooltip title={feature.title} arrow key={index}>
          <Box
            onClick={() => callback(feature)}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              border: "solid 1px #564FEE",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: Color.background.purple_opacity,
              minWidth: { md: "170px", xs: "110px" },
              maxWidth: { md: "170px", xs: "110px" },
              gap: "10px",
              transition: "background-color 0.3s",
            }}
          >
            <SvgIcon sx={{ color: Color.text.primary, fontSize: "40px" }}>{feature.icon}</SvgIcon>
            <Typography
              sx={{
                color: Color.text.primary,
                fontSize: "16px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {feature.title}
            </Typography>
          </Box>
        </Tooltip>
      ))}
    </div>
  );
};

export default FeaturesGroup;
