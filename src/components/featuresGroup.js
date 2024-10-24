import React from "react";
import { SvgIcon, Typography, Tooltip, Box } from "@mui/material";
import Color from "../theme/colors";

const FeaturesGroup = ({ current, features, callback }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: { md: "40px", xs: "20px" },
        marginLeft: 0,
        marginTop: "16px",
      }}
    >
      {features?.map((feature, index) => (
        <Tooltip title={feature.title} arrow key={index}>
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Box
              onClick={() => callback(feature)}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "5px",
                borderRadius: "3px",
                border: `solid 1px ${Color.background.purple}`,
                backgroundColor: Color.background.purple_opacity01,
                minWidth: { md: "110px", xs: "90px" },
                maxWidth: { md: "110px", xs: "90px" },
                height: "110px",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: Color.background.purple_opacity,
                },
              }}
            >
              <SvgIcon
                sx={{
                  color: Color.text.primary,
                  fontSize: { md: "50px", xs: "35px" },
                }}
              >
                {feature.icon}
              </SvgIcon>
            </Box>
            <Typography
              sx={{
                textAlign: "center",
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
    </Box>
  );
};

export default FeaturesGroup;
