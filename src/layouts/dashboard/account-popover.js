import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuth } from "src/hooks/use-auth";
import PropTypes from "prop-types";

import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Color from "src/theme/colors";

export const AccountPopover = (props) => {
  const { t } = useTranslation();
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();

  const onSignOut = useCallback(() => {
    onClose?.();
    auth.SignOut();
    router.push("/auth/login");
  }, [onClose, auth, router]);

  const onOpenProfile = async () => {
    try {
      router.push("/profile");
    } catch (error) {
      console.log("redirect router error", error);
    }
  };
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: 190,
          mt: 1,
          backgroundColor: Color.background.main,
          border: `solid 1px ${Color.background.border}`,
          color: Color.text.primary,
        },
      }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        {auth.user === null ? "GHOSTSPY" : <Typography>{auth.user?.username}</Typography>}
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          py: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        {/* <MenuItem
          onClick={onOpenProfile}
          sx={{ display: "flex", gap: "5px", alignItems: "center" }}
        >
          {" "}
          <AccountCircleIcon />
          {t("profileMenu.profile")}
        </MenuItem> */}
        <MenuItem onClick={onSignOut} sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <ExitToAppIcon />
          {t("profileMenu.signOut")}
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
