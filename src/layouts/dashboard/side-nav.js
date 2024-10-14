import React from "react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";

import { Box, Drawer, Stack, useMediaQuery, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";

import Color from "src/theme/colors";

export const SideNav = (props) => {
  const { open, onClose, collapsed, setCollapsed, ref } = props;
  const { t } = useTranslation();
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const onControlMenu = () => {
    setCollapsed((prev) => !prev);
  };

  const onGooglePlay = () => {
    console.log("google play");
  };

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: Color.background.main,
          borderRight: `solid 1px ${Color.background.border}`,
        }}
      >
        <Box sx={{ py: 3, px: 1, ml: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              height: 32,
              width: 32,
            }}
          >
            <IconButton
              className="camera-toolbar"
              sx={{ color: Color.text.secondary }}
              onClick={onControlMenu}
            >
              {!collapsed ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
            </IconButton>
          </Box>
        </Box>

        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack
              component="ul"
              spacing={0.5}
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
              }}
            >
              {items.map((item) => {
                const active = item.path ? pathname === item.path : false;

                return (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled}
                    external={item.external}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                    collapsed={collapsed}
                    onClose={onClose}
                  />
                );
              })}
            </Stack>

            <Box sx={{ mb: 2 }}>
              <Box
                onClick={onGooglePlay}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  backgroundColor: Color.background.purple_opacity,
                  border: `solid 1px ${Color.background.purple}`,
                  borderRadius: "5px",
                  p: 1,
                  "&:hover": {
                    backgroundColor: Color.background.purple_opacity01,
                  },
                }}
              >
                <img src="/assets/icons/google_play_ic.webp" alt="Logo" style={{ width: "28px" }} />

                <Box sx={{ display: collapsed ? "none" : "block" }}>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: Color.text.main,
                    }}
                  >
                    {t("dashboardMenus.get-in")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: Color.text.main,
                    }}
                  >
                    {t("dashboardMenus.google-play")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Scrollbar>
  );

  return (
    <Drawer
      ref={ref}
      anchor="left"
      open={open}
      onClose={onClose}
      hideBackdrop={!lgUp}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: collapsed ? 80 : 200,
          transition: "width 0.3s",
        },
      }}
      variant={lgUp ? "permanent" : "temporary"}
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  ref: PropTypes.any,
};
