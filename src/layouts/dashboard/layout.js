import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import useOutsideClick from "../../hooks/use-outside-click";
import Color from "src/theme/colors";

const SIDE_NAV_WIDTH = 200;

const LayoutRoot = styled("div")(({ theme, collapsed }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("md")]: {
    paddingLeft: collapsed ? 80 : SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("md"));
  const openNavRef = useRef(openNav);
  const navRef = useRef(null);

  useOutsideClick(navRef, () => setOpenNav(false));

  const handlePathnameChange = useCallback(() => {
    if (openNavRef.current) {
      setOpenNav(false);
    }
  }, []);

  useEffect(() => {
    openNavRef.current = openNav;
  }, [openNav]);

  useEffect(() => {
    handlePathnameChange();
  }, [pathname, handlePathnameChange]);

  return (
    <React.Fragment>
      <div ref={navRef}>
        <SideNav
          onClose={() => setOpenNav(false)}
          open={openNav}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <LayoutRoot
        collapsed={collapsed}
        style={{
          backgroundImage: `linear-gradient(rgb(15 21 53), rgb(15 21 53 / 54%)), url("/assets/background/wavy-black-white-background.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopNav onNavOpen={() => setOpenNav(true)} />
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </React.Fragment>
  );
});
