import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";

export const VideoContent = () => {
  const { t } = useTranslation();
  const user = useAuth();

  return (
    <React.Fragment>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          px: 4,
        }}
      >
        <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
          {t("videoPage.video")}
        </Typography>
      </Box>
    </React.Fragment>
  );
};
