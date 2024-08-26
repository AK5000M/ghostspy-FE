import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player/lazy";

import { Container, Box, Grid, Typography, Hidden } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { SolutionSection } from "../home/solution";
import { DirectionSection } from "../home/direction";
import { PlatformSection } from "../home/platform";

import { Fade, Slide } from "react-awesome-reveal";
import Color from "../../theme/colors";

export const TutorialContent = () => {
  const { t } = useTranslation();

  const [playing, setPlaying] = useState(false); // Initially set playing to false

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

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

        <Container maxWidth={"xl"} sx={{ mt: "100px" }}>
          <Grid spacing={3} width={"100%"}>
            <Grid sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
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
                {t("tutorial.sm-title")}
              </Typography>
            </Grid>

            <Grid
              sx={{
                my: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
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
                  {t("dashboard.introduce.greeting")}
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
                    width: { md: "60%", xs: "95%" },
                    textAlign: "center",
                    color: Color.theme.gray1,
                    fontSize: "20px",
                  }}
                  dangerouslySetInnerHTML={{ __html: t("dashboard.introduce.introduce") }}
                />
              </Slide>
            </Grid>

            <Grid
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Grid
                sx={{
                  backgroundColor: "#564FEE30",
                  borderRadius: "5px",
                  position: "relative",
                  width: { md: "70%", xs: "100%" },
                  height: "450px",
                  overflow: "hidden",
                }}
              >
                {/* {!playing && (
                  <Grid
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark background when paused
                      zIndex: 1,
                      borderRadius: "5px",
                    }}
                  />
                )} */}
                <ReactPlayer
                  className="video"
                  url="https://youtu.be/Njm6CTHyz2E?si=LkgujsWsnmhXwQjy"
                  playing={true}
                  loop={true}
                  controls={true}
                  width="100%"
                  height="100%"
                  sx={{ p: 3 }}
                />
                {/* <Grid
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    cursor: "pointer",
                  }}
                  onClick={togglePlayPause}
                >
                  {playing ? (
                    <PauseCircleOutlineIcon
                      style={{ fontSize: 60, color: "rgb(29 191 26 / 55%)" }}
                    />
                  ) : (
                    <PlayCircleOutlineIcon style={{ fontSize: 60, color: "#564FEE" }} />
                  )}
                </Grid> */}
              </Grid>
            </Grid>

            <Grid
              sx={{
                width: "100%",
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

        <Container maxWidth={"xl"} sx={{ mt: "60px" }}>
          <DirectionSection />
        </Container>
        <Container maxWidth={"xl"} sx={{ mt: "60px" }}>
          <SolutionSection />
        </Container>
        <Footer />
      </Box>
    </React.Fragment>
  );
};
