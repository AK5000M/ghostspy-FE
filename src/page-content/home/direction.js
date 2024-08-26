import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Fade, Slide } from "react-awesome-reveal";

export const DirectionSection = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Grid
      container
      spacing={4}
      sx={{
        backgroundImage: `linear-gradient(rgb(0 0 0 / 50%),  rgb(17 25 39)), url("/assets/images/background/background02.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "5px",
      }}
    >
      {/* Left Content */}
      <Grid item md={12} lg={4} sx={{ display: "flex", alignItems: "center" }}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          <Fade cascade triggerOnce={true}>
            <Typography
              variant="h4"
              sx={{
                color: "#564FEE",
                textAlign: "center",
                lineHeight: "35px",
                fontWeight: 600,
                fontFamily: "Teko, sans-serif",
              }}
            >
              {t("direction.title")}
            </Typography>
          </Fade>
          <Slide
            direction="up"
            triggerOnce={true}
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#f1f1f1",
                textAlign: "center",
              }}
            >
              {t("direction.description")}
            </Typography>
          </Slide>
        </Grid>
      </Grid>
      {/* Center Image */}
      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {/* Add your image component here */}
        <Box
          component="img"
          src="/assets/shape-06.webp"
          alt="Image"
          sx={{ width: "100%", maxWidth: "300px" }}
        />
      </Grid>
      {/* Right Register Button */}
      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          onClick={() => router.push("/auth/register")}
          sx={{
            bg: "#564FEE",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#564FEE",
            },
          }}
        >
          {t("direction.action")}
        </Button>
      </Grid>
    </Grid>
  );
};
