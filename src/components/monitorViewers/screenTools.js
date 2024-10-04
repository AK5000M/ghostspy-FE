import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

import { Box } from "@mui/material";

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

  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });

  const onOpenMobileToolbar = () => {
    setOpenMobileToolbar(true);
  };

  const onCloseMobileToolbar = () => {
    console.log("close");
    setOpenMobileToolbar(false);
  };
  console.log("openMobileToolbar:", openMobileToolbar);
  return (
    <Box
      sx={{
        position: "absolute",
        right: { sm: "-155px", xs: "0px" },
        bottom: { sm: "5px", xs: "32px" },
        width: { sm: "140px", xs: "100%" },
        height: { sm: "100%", xs: "250px" },
        zIndex: 999,
      }}
    >
      {/* Mobile menu icon */}
      <Box sx={{ display: { sm: "none", xs: "block" }, px: 1 }}>
        {openMobileToolbar ? (
          <CloseOutlinedIcon
            onClick={onCloseMobileToolbar}
            sx={{
              borderRadius: "5px",
              backgroundColor: Color.background.main,
              border: `solid 1px ${Color.background.purple}`,
              color: Color.text.primary,
            }}
          />
        ) : (
          <ListOutlinedIcon
            onClick={onOpenMobileToolbar}
            sx={{
              borderRadius: "5px",
              backgroundColor: Color.background.main,
              border: `solid 1px ${Color.background.purple}`,
              color: Color.text.primary,
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          height: "100%",
          background: Color.background.secondary,
          border: `solid 1px ${Color.background.purple}`,
          borderRadius: "5px",
          py: { md: "20px", xs: "5px" },
          px: "5px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Black and Lock */}

        <ScreenOptionsPanel device={device} lock={lock} black={black} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { sm: "column", xs: "row" },
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
  );
};

export default ScreenToolbar;
