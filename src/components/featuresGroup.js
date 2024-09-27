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
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              padding: "5px",
              borderRadius: "5px",
              border: `solid 1px ${Color.background.purple}`,
              backgroundColor: Color.background.purple_opacity,
              minWidth: { md: "170px", xs: "110px" },
              maxWidth: { md: "170px", xs: "110px" },
              height: "130px",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: Color.background.purple,
              },
            }}
          >
            <SvgIcon
              sx={{
                color: Color.text.primary,
                fontSize: "50px",
              }}
            >
              {feature.icon}
            </SvgIcon>
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
