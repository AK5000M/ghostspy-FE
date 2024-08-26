import React from "react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import Color from "src/theme/colors";

export const SideNavItem = (props) => {
  const { t } = useTranslation();
  const { active = false, disabled, external, icon, path, title, collapsed, onClose } = props;
  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Tooltip title={collapsed ? t(title) : ""} placement="right" arrow>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "flex-start",
          pl: "12px",
          pr: "16px",
          py: "10px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: Color.background.purple,
          }),
          "&:hover": {
            backgroundColor: Color.background.purple,
          },
        }}
        {...linkProps}
        onClick={handleClick}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: Color.text.main,
              mr: collapsed ? 0 : 2,
              ...(active && {
                color: Color.text.primary,
              }),
            }}
          >
            {icon}
          </Box>
        )}
        {!collapsed && (
          <Typography
            sx={{
              fontSize: "18px",
              color: Color.text.main,
              ...(active && {
                color: Color.text.primary,
              }),
            }}
          >
            {t(title)}
          </Typography>
        )}
      </ButtonBase>
    </Tooltip>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
  onClose: PropTypes.func,
};
