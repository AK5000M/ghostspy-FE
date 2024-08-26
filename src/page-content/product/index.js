import React from "react";
import { useTranslation } from "react-i18next";

import { Container, Box, Grid, Typography } from "@mui/material";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { SolutionSection } from "../home/solution";
import { DirectionSection } from "../home/direction";
import { FunctionSection } from "../product/function";

import { Fade, Slide } from "react-awesome-reveal";
import Color from "../../theme/colors";

export const ProductContent = () => {
  const { t } = useTranslation();

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

        <Container
          maxWidth={"xl"}
          sx={{
            maxWidth: "100%",
            px: 3,
            py: "100px",
            width: "100%",
            mt: { md: "50px", xs: "0px" },
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
                {t("product.sm-title")}
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
              }}
            >
              <Fade
                cascade
                triggerOnce={true}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    color: Color.theme.light,
                    fontSize: { md: "40px", xs: "28px" },
                    width: { md: "70%", xs: "100%" },
                    fontFamily: "Anton SC, sans-serif",
                  }}
                >
                  {t("product.title")}
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
                    color: Color.theme.gray1,
                    fontSize: "20px",
                    textAlign: "center",
                    width: { md: "60%", xs: "100%" },
                  }}
                >
                  {t("product.description")}
                </Typography>
              </Slide>
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
          <FunctionSection />
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
            py: "50px",
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
