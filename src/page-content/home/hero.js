import { Box, Grid, Typography, Container, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { Fade, Slide } from "react-awesome-reveal";
import Color from "../../theme/colors";

export const HeroSection = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        backgroundImage: `linear-gradient(rgb(0 0 0 / 30%), rgb(17 25 39)), url("/assets/images/background/2222_upscayl_4x_realesrgan-x4plus.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        pt: 10,
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                px: "15px",
                pt: "3px",
                pb: "5px",
                borderRadius: "50px",
                backgroundColor: "#000000a8",
                border: "solid 1px #03ff8470",
                textAlign: "center",
                color: "#564FEE",
              }}
            >
              {t("home.hero-sm-title")}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "25px",
            }}
          >
            <Fade cascade triggerOnce={true}>
              <Typography
                variant="h1"
                sx={{
                  textAlign: "center",
                  color: Color.theme.lightest,
                  fontSize: { md: "58px", xs: "42px" },
                  lineHeight: { md: "50px" },
                  fontFamily: "Anton SC, sans-serif",
                  padding: "20px 0px",
                }}
              >
                {t("home.hero-title")}
              </Typography>
            </Fade>
            <Slide
              direction="up"
              triggerOnce={true}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: Color.theme.light,
                  fontSize: "20px",
                  textAlign: "center",
                  width: { md: "80%", xs: "100%" },
                }}
              >
                {t("home.hero-description")}
              </Typography>
            </Slide>

            <Button
              onClick={() => router.push("/auth/login")}
              sx={{
                background: "#d4ffc9eb",
                border: "solid 2px #564FEE",
                padding: "10px 30px",
                borderRadius: "50px",
                "&:hover": {
                  color: "white",
                },
              }}
            >
              {t("home.hero-action")}
            </Button>
          </Grid>
        </Grid>

        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              mt: 5,
            }}
          >
            <Box
              component="img"
              src="/assets/home/hero-img.webp"
              alt="Hero Image"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to bottom, rgb(0 0 0 / 60%), rgb(17 25 39))",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Grid>
      </Container>
    </Grid>
  );
};
