import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid, IconButton, Box, Button, Typography, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Languages from "./languageSelect";
import { useRouter } from "next/router";

import { HomeMenu } from "./homeMenu";

const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    // { text: t("menuLists.home"), url: "/home" },
    // { text: t("menuLists.product"), url: "/product" },
    // { text: t("menuLists.tutorials"), url: "/tutorials" },
    // { text: t("menuLists.prices"), url: "/prices" },
    // { text: t("menuLists.partners"), url: "/partners" },
    // { text: t("menuLists.support"), url: "/contact" },
  ];

  const onLoginPage = () => {
    router.push("/auth/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    router.push("/auth/login");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "85px",
        display: "flex",
        alignItems: "center",
        backdropFilter:
          "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
        position: "fixed",
        zIndex: "1000",
        backgroundColor: " #212631",
      }}
    >
      <Container maxWidth={"xl"} sx={{ py: 1 }}>
        <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="main-logo"
            onClick={handleLogoClick}
          >
            <img
              src="/assets/logos/spy/ghostspy-logo-_2_.webp"
              alt="Logo"
              style={{ width: "180px" }}
            />
          </IconButton>

          <Grid sx={{ display: { xs: "none", md: "block", cursor: "pointer" } }}>
            <HomeMenu menuItems={menuItems} />
          </Grid>

          <Grid>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              {router.pathname !== "/auth/login" && (
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={onLoginPage}
                  className="transfer-button"
                >
                  {t("home.login")}
                </Button>
              )}

              <Languages />
            </Box>

            {/* Menu icon for mobile view */}
            <MenuIcon
              onClick={toggleMenu}
              sx={{ display: { xs: "flex", md: "none", cursor: "pointer" }, color: "white" }}
            />
            {isMenuOpen && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "280px",
                  height: "100%",
                  backgroundColor: "transparent",
                  transition: "left 0.5s ease-in-out",
                  zIndex: 999,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#212631",
                    padding: 2,
                    borderRadius: 1,
                    width: "100%",
                    height: "100%",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Grid sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <CloseIcon onClick={toggleMenu} sx={{ cursor: "pointer" }} />
                  </Grid>

                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      className="main-logo"
                    >
                      <img
                        src="/assets/logos/spy/ghostspy-logo-_2_.webp"
                        alt="Logo"
                        style={{ width: "180px" }}
                      />
                    </IconButton>
                    <Grid sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                      <Languages />
                    </Grid>
                    <Button
                      color="inherit"
                      variant="outlined"
                      onClick={onLoginPage}
                      sx={{ mr: 2, mt: 6, width: "100%" }}
                      className="mobile-transfer-button"
                    >
                      {t("home.login")}
                    </Button>
                  </Grid>

                  <Grid
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      mt: 3,
                    }}
                  >
                    {menuItems.map((item, index) => (
                      <Grid item key={index}>
                        <Typography
                          sx={{
                            fontSize: { xs: "14px", lg: "18px" },
                            mb: 2,
                            color: "white",
                          }}
                        >
                          <Link
                            href={item.url}
                            underline="none"
                            sx={{
                              fontSize: "14px",
                              textDecoration: "none",
                              color: "white",
                            }}
                          >
                            {item.text}
                          </Link>
                        </Typography>
                      </Grid>
                    ))}
                    <Typography variant="body1">
                      <Link
                        href="/term-condition"
                        sx={{
                          fontSize: "14px",
                          textDecoration: "none",
                          color: "white",
                        }}
                      >
                        {t("menuLists.termAndConditions")}
                      </Link>
                    </Typography>
                  </Grid>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Header;
