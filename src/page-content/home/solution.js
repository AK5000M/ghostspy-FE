import { Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { Fade, Slide } from "react-awesome-reveal";

export const SolutionSection = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Grid container spacing={4} sx={{ marginBottom: "80px" }}>
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
          {t("home.solution-sm-title")}
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
        <Fade cascade triggerOnce={true} style={{ display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              color: "#564FEE",
              lineHeight: "38px",
              fontWeight: 600,
              fontFamily: "Teko, sans-serif",
            }}
          >
            {t("home.solution-title")}
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
              textAlign: "center",
              width: { md: "80%", xs: "100%" },
            }}
          >
            {t("home.solution-description")}
          </Typography>
        </Slide>
      </Grid>
      <Grid
        sx={{
          width: "100%",
          display: { md: "flex", xs: "grid" },
          justifyContent: "center",
          gap: { md: "50px", xs: "20px" },
          mt: 5,
        }}
      >
        <Button
          onClick={() => router.push("/auth/login")}
          sx={{
            border: "solid 1px #564FEE",
            // width: { md: "20%", xs: "100%" },
            borderRadius: "5px",
            "&:hover": {
              color: "white",
            },
          }}
        >
          {t("home.hero-action")}
        </Button>
        <Button
          onClick={() => router.push("/support")}
          variant="contained"
          sx={{
            bg: "#564FEE",
            // width: { md: "20%", xs: "100%" },
            borderRadius: "5px",
          }}
        >
          {t("home.solution-support")}
        </Button>
      </Grid>
    </Grid>
  );
};
