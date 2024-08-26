import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { Avatar, Box, IconButton, Grid, SvgIcon, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import Languages from "../../components/languageSelect";
import { useAuth } from "src/hooks/use-auth";
import { useEffect, useState } from "react";
import Color from "src/theme/colors";

const SIDE_NAV_WIDTH = 0;
const TOP_NAV_HEIGHT = 87;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const accountPopover = usePopover();
  const auth = useAuth();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [filterName, setFilterName] = useState(null);

  useEffect(() => {
    if (auth) {
      setAvatarUrl(auth.user?.avatarUrl);
      const combineName = auth.user?.username[0];
      setFilterName(combineName);
    }
  }, [auth]);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
        style={{
          backgroundColor: Color.background.main,
          borderBottom: `solid 1px ${Color.background.border}`,
        }}
      >
        <Grid
          container
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Grid item>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Grid>

          <Grid item sx={{ display: { xs: "none", md: "block" } }}>
            <img
              src="/assets/logos/spy/ghostspy-logo-_2_.webp"
              alt="Logo"
              style={{ width: "180px" }}
            />
          </Grid>

          <Grid item sx={{ display: "flex" }}>
            <Languages />
            <Grid item>
              {avatarUrl ? (
                <Avatar
                  onClick={accountPopover.handleOpen}
                  ref={accountPopover.anchorRef}
                  sx={{
                    cursor: "pointer",
                    height: 40,
                    width: 40,
                  }}
                  src={avatarUrl}
                />
              ) : (
                <Grid
                  onClick={accountPopover.handleOpen}
                  ref={accountPopover.anchorRef}
                  sx={{
                    backgroundColor: Color.background.purple_opacity,
                    borderRadius: "50%",
                    border: `solid 1px ${Color.background.purple}`,
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    onClick={accountPopover.handleOpen}
                    ref={accountPopover.anchorRef}
                    sx={{
                      cursor: "pointer",
                      height: 40,
                      width: 40,
                      backgroundColor: Color.background.purple_opacity,
                    }}
                  >
                    {filterName ? String(filterName) : "You"}
                  </Avatar>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
