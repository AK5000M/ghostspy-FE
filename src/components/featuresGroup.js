import React from "react";
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
        gap: "40px",
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
              borderRadius: "3px",
              border: `solid 1px ${Color.background.purple}`,
              backgroundColor: Color.background.purple_opacity01,
              minWidth: { md: "170px", xs: "110px" },
              maxWidth: { md: "170px", xs: "110px" },
              height: "130px",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: Color.background.purple_opacity,
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
                width: "100px",
                color: Color.text.primary,
                fontSize: "12px",
                fontWeight: 500,
                textAlign: "center",
                fontFamily: "Archivo,sans-serif",
                textTransform: "uppercase",
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
