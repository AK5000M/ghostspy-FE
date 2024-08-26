import { Box, Grid, Typography, Card, CardContent, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Fade } from "react-awesome-reveal";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import RemoteControlIcon from "@mui/icons-material/SettingsRemote";
import DevicesIcon from "@mui/icons-material/Devices";
import InterfaceIcon from "@mui/icons-material/TouchApp";
import SecurityIcon from "@mui/icons-material/Security";
import MonitorIcon from "@mui/icons-material/Monitor";
import Color from "../../theme/colors";

export const PlatformSection = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const features = [
    {
      title: t("home.platform-simple-title"),
      description: t("home.platform-simple-description"),
      icon: <ScreenShareIcon style={{ fontSize: 60, color: "#564FEE" }} />,
    },
    {
      title: t("home.platform-remote-title"),
      description: t("home.platform-remote-description"),
      icon: <RemoteControlIcon style={{ fontSize: 60, color: "#564FEE" }} />,
    },
    {
      title: t("home.platform-multi-title"),
      description: t("home.platform-multi-description"),
      icon: <DevicesIcon style={{ fontSize: 60, color: "#564FEE" }} />,
    },
    {
      title: t("home.platform-friendly-title"),
      description: t("home.platform-friendly-description"),
      icon: <InterfaceIcon style={{ fontSize: 60, color: "#564FEE" }} />,
    },
    {
      title: t("home.platform-private-title"),
      description: t("home.platform-private-description"),
      icon: <SecurityIcon style={{ fontSize: 60, color: "#564FEE" }} />,
    },
    {
      title: t("home.platform-real-title"),
      description: t("home.platform-real-description"),
      icon: <MonitorIcon style={{ fontSize: 60, color: "#564FEE" }} />,
    },
  ];

  return (
    <Grid container spacing={4}>
      {features.map((feature, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Fade>
            <Card
              className="platform-card"
              sx={{
                backgroundColor: "unset",
                textAlign: "center",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>{feature.icon}</Box>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{
                    color: Color.theme.light,
                    fontWeight: 600,
                    fontFamily: "Teko, sans-serif",
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: Color.theme.gray1 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};
