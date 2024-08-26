// components/Menu.js

import React from "react";
import { useTranslation } from "react-i18next";

import { Grid, Link, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export const HomeMenu = (props) => {
  const { menuItems } = props;
  const { t } = useTranslation();
  // Mobile Responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Grid container spacing={isMobile ? 3 : 5} justifyContent="center">
      {menuItems.map((item, index) => (
        <Grid item key={index}>
          <Link href={item.url} underline="none">
            <Typography
              sx={{
                fontSize: { xs: "14px", lg: "18px" },
                color: "white",
                "&:hover": {
                  color: "#564FEE",
                },
              }}
            >
              {item.text}
            </Typography>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};
