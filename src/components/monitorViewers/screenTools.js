import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import { Box, IconButton } from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

import ScreenControlBox from "./toolbar/screenControlBox";
import ScreenControlPanel from "./toolbar/screenControlPanel";
import ScreenSettingsPanel from "./toolbar/screenSettingPanel";
import ScreenOptionsPanel from "./toolbar/screenOptionsPanel";

import Color from "src/theme/colors";

const ScreenToolbar = ({ visible, device, black, lock }) => {
  const { t } = useTranslation();

  const [openMobileToolbar, setOpenMobileToolbar] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 475px)" });

  const onOpenMobileToolbar = () => {
    setOpenMobileToolbar(true);
  };

  const onCloseMobileToolbar = () => {
    setOpenMobileToolbar(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        right: { sm: "-155px", xs: "0px" },
        bottom: { sm: "5px", xs: "-50px" },
        width: { sm: "140px", xs: "100%" },
        height: { sm: "100%", xs: openMobileToolbar ? "350px" : "auto" }, // Show toolbar only when open
        zIndex: 999,
      }}
    >
      <Box sx={{ position: "relative", height: "100%" }}>
        {/* Mobile menu icon (bottom-left corner) */}
        {isMobile && (
          <Box
            sx={{
              position: "fixed",
              bottom: "10px",
              left: "5px",
              zIndex: 1000,
              backgroundColor: Color.background.main,
              borderRadius: "5px",
              border: `solid 1px ${Color.background.purple}`,
            }}
          >
            {openMobileToolbar ? (
              <IconButton
                onClick={onCloseMobileToolbar}
                sx={{
                  color: Color.text.primary,
                  cursor: "pointer",
                  padding: "5px",
                  backgroundColor: Color.background.secondary,
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={onOpenMobileToolbar}
                sx={{
                  color: Color.text.primary,
                  cursor: "pointer",
                  padding: "5px",
                  backgroundColor: Color.background.secondary,
                }}
              >
                <ListOutlinedIcon />
              </IconButton>
            )}
          </Box>
        )}

        {/* Toolbar Panels (only visible when openMobileToolbar is true) */}
        <Box
          sx={{
            display: { sm: "flex", xs: openMobileToolbar ? "flex" : "none" }, // Toggle visibility in mobile
            flexDirection: "column",
            justifyContent: { sm: "space-between", xs: "flex-start" },
            height: "100%",
            background: Color.background.secondary,
            border: `solid 1px ${Color.background.purple}`,
            borderRadius: "5px",
            py: { md: "20px", xs: "5px" },
            px: "5px",
          }}
        >
          {/* Black and Lock */}
          <ScreenOptionsPanel device={device} lock={lock} black={black} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
            }}
          >
            {/* Screen Control Panel */}
            <ScreenControlPanel device={device} />
            {/* Screen Button Control */}
            <ScreenControlBox device={device} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ScreenToolbar;
