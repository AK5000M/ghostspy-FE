import { Container, Box, Grid, Typography, Link, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Email, WhatsApp, YouTube } from "@mui/icons-material";

const Footer = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/home");
  };

  const menuItems = [
    { text: t("menuLists.home"), url: "/home" },
    { text: t("menuLists.product"), url: "/product" },
    { text: t("menuLists.tutorials"), url: "/tutorials" },
    { text: t("menuLists.prices"), url: "/prices" },
    // { text: t("menuLists.partners"), url: "/partners" },
    { text: t("menuLists.support"), url: "/contact" },
  ];

  return (
    <div style={{ backgroundColor: "#000" }}>
      <Container maxWidth={"xl"} sx={{ py: 8, px: 3 }}>
        <Box
          sx={{
            color: "#fff",
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            {/* Left Grid: Logo */}
            <Grid
              item
              xs={12}
              md={4}
              container
              alignItems="flex-start"
              justifyContent="flex-start"
              marginBottom={"30px"}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                className="main-logo"
                onClick={handleLogoClick}
              >
                <img src="/assets/logos/logo-png.webp" alt="Logo" style={{ width: "180px" }} />
              </IconButton>
              <Typography variant="body1">{t("register.introduce")}</Typography>
            </Grid>

            {/* Center Grid: Menu */}
            <Grid
              item
              xs={12}
              md={4}
              container
              direction="column"
              alignItems="center"
              gap={2}
              marginBottom={"30px"}
            >
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

            {/* Right Grid: Terms */}
            <Grid
              item
              xs={12}
              md={4}
              container
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Typography variant="body1">
                <Link
                  href="/term-condition"
                  sx={{
                    fontSize: { xs: "14px", lg: "18px" },
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  {t("menuLists.termAndConditions")}
                </Link>
              </Typography>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                {/* <IconButton
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "white" }}
                >
                  <FacebookIcon />
                </IconButton> */}
                {/* <IconButton
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "white" }}
                >
                  <TwitterIcon />
                </IconButton> */}
                <IconButton
                  component="a"
                  href=" https://www.instagram.com/techdroidspy?igsh=MTdqNThvcXdhbXNndg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "white" }}
                >
                  <InstagramIcon />
                </IconButton>
                {/* <IconButton
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "white" }}
                > 
                  <LinkedInIcon />
                </IconButton> */}
                <IconButton
                  component="a"
                  href="https://www.youtube.com/@TechDroidSpy"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "white" }}
                >
                  <YouTube />
                </IconButton>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="start" sx={{ mt: 3 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <WhatsApp />
                  <Typography variant="body1" ml={1}>
                    WhatsApp:{" "}
                    <Link href="https://wa.me/5531912818" target="_blank" rel="noopener">
                      +55 31 3191-2818
                    </Link>
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Email />
                  <Typography
                    variant="body1"
                    ml={1}
                    noWrap
                    sx={{ overflow: "hidden", width: "220px", textOverflow: "ellipsis" }}
                  >
                    Email:{" "}
                    <Link
                      href="mailto:atendimento@techdroidsuporte.online"
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      atendimento@techdroidsuporte.online
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Grid sx={{ py: 2, backgroundColor: "#111927" }}>
        <Typography variant="body2" sx={{ color: "#f1f1f1", textAlign: "center" }}>
          &copy; {new Date().getFullYear()} TechDroid. All rights reserved.
        </Typography>
      </Grid>
    </div>
  );
};

export default Footer;
