import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Box, Grid, Typography } from "@mui/material";
import Header from "../../components/header";
import Footer from "../../components/footer";

export const TermAndConditionContent = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: `url("/assets/images/background/background02.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header />

        <Container sx={{ px: 3, py: "30px", mt: 14 }} className="term-board">
          <Grid container>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{ color: "#564FEE", fontFamily: "Anton SC, sans-serif", marginBottom: "20px" }}
              >
                {t("termConditionPage.title")}
              </Typography>
            </Grid>
            {termSections.map((section, index) => (
              <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: "white" }}>
                  {t(section.title)}
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {t(section.content)}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Footer />
      </Box>
    </React.Fragment>
  );
};

const termSections = [
  { title: "termConditionPage.introduce.title", content: "termConditionPage.introduce.content" },
  {
    title: "termConditionPage.deviceMonitoring.title",
    content: "termConditionPage.deviceMonitoring.content",
  },
  {
    title: "termConditionPage.responsibilityLegality.title",
    content: "termConditionPage.responsibilityLegality.content",
  },
  {
    title: "termConditionPage.privacyCivil.title",
    content: "termConditionPage.privacyCivil.content",
  },
  {
    title: "termConditionPage.dataCollection.title",
    content: "termConditionPage.dataCollection.content",
  },
  {
    title: "termConditionPage.userResponsibility.title",
    content: "termConditionPage.userResponsibility.content",
  },
  { title: "termConditionPage.changeTerm.title", content: "termConditionPage.changeTerm.content" },
];
