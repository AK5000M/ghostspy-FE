import React from "react";
import { useTranslation } from "react-i18next";

import { Container, Box, Grid, Typography, Button } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { HeroSection } from "./hero";
import { PlatformSection } from "./platform";
import { SolutionSection } from "./solution";
import { DirectionSection } from "./direction";

import { Fade, Slide } from "react-awesome-reveal";

export const HomeContent = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "#111927",
        }}
      >
        <Grid sx={{ position: "relative" }}>
          <Header />
        </Grid>
        <Grid sx={{ mt: "100px" }}>
          <HeroSection />
        </Grid>

        <Container
          maxWidth={"xl"}
          sx={{
            maxWidth: "100%",
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
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
                  backgroundColor: "#564FEE30",
                  border: "solid 1px #564FEE7a",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {t("home.platform-sm-title")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "80%",
              }}
            >
              <Fade
                cascade
                triggerOnce={true}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#564FEE",
                    fontSize: { md: "40px", xs: "28px" },
                    width: { md: "70%", xs: "100%" },
                    fontFamily: "Anton SC, sans-serif",
                    mb: 5,
                  }}
                >
                  {t("home.platform-title")}
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
                    color: "#f1f1f1",
                    fontSize: "20px",
                    textAlign: "center",
                    width: { md: "80%", xs: "100%" },
                  }}
                >
                  {t("home.platform-description")}
                </Typography>
              </Slide>
            </Grid>

            <Grid
              sx={{
                mt: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlatformSection />
            </Grid>
          </Grid>
        </Container>

        <Container
          maxWidth={"xl"}
          sx={{
            maxWidth: "100%",
            px: 3,
            py: "50px",
            width: "100%",
          }}
        >
          <DirectionSection />
        </Container>

        <Container
          maxWidth={"xl"}
          sx={{
            maxWidth: "100%",
            px: 3,
            py: "80px",
            width: "100%",
          }}
        >
          <SolutionSection />
        </Container>

        <Footer />
      </Box>
    </React.Fragment>
  );
};
