import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Container, Box, Grid, Typography, Button, CircularProgress } from "@mui/material";

import LinearProgress from "@mui/material/LinearProgress";

import SouthIcon from "@mui/icons-material/South";
import AppIcon from "./appIcon";

import Color from "src/theme/colors";
import { useAuth } from "src/hooks/use-auth";

import { apkBuild, getApkFile } from "src/store/actions/apk.action";
import Information from "./information";

const arrowStyles = {
  color: "#564FEE",
  animation: "moveDown 1.5s infinite",
};

export const BuilderAPKContent = () => {
  const { t } = useTranslation();
  const user = useAuth();

  const [appName, setAppName] = useState(null);
  const [appIcon, setAppIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buildLoading, setBuildLoading] = useState(false);
  const [createdApk, setCreatedApk] = useState(false);

  // Open Create New APK Panel
  const onOpenCreatePanel = async () => {
    setCreatedApk(true);
  };

  //Create New APK
  const onCreateNewAPK = async () => {
    try {
      setBuildLoading(true);
      const userId = user?.user?._id;

      const formData = new FormData();

      if (appName == null || appIcon == null) {
        setBuildLoading(false);
        toast.error(t("toast.error.app-info"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
        return;
      }

      formData.append("userId", userId);
      formData.append("appName", appName);
      if (appIcon) {
        formData.append("appIcon", appIcon);
      }

      // Create New APK
      const res = await apkBuild(formData);
      if (res.success == true) {
        setBuildLoading(false);
        setCreatedApk(true);

        toast.success(t("toast.success.create-apk"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.green_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });

        setCreatedApk(false);
      }
    } catch (error) {
      setBuildLoading(false);
      console.log("create new apk error", error);
    }
  };

  // Download New APK
  const handleDownloadApk = async () => {
    try {
      setLoading(true);
      const apkName = user?.user?.apkName;
      const response = await getApkFile({ userId: user?.user._id, apkName: apkName });

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${apkName}.apk`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Download new apk error", error);
    }
  };

  // Back Main
  const onBackToMainPanel = async () => {
    setCreatedApk(false);
  };
  console.log({ user });
  return (
    <Grid
      component="main"
      sx={{
        py: 6,
      }}
    >
      <Container maxWidth="xxl">
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography
              variant="body1"
              style={{
                fontFamily: "Teko, sans-serif",
                color: Color.text.primary,
                fontSize: "34px",
              }}
            >
              {t("buildAPKPage.builder")}
            </Typography>

            <Typography
              variant="body1"
              style={{
                marginBottom: 16,
                textAlign: "center",
                color: Color.text.primary,
                fontSize: "18px",
              }}
            >
              {t("buildAPKPage.create-description")}
            </Typography>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: Color.background.main_gray01,
                border: `solid 1px ${Color.background.border}`,
                borderRadius: "5px",
                padding: "24px",
                minHeight: "500px",
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                gap: "20px",
              }}
            >
              {user.user?.status == "allowed" ? (
                <React.Fragment>
                  <Box sx={{ flex: 1, width: { md: "450px", xs: "100%" } }}>
                    {createdApk ? (
                      <Box
                        sx={{
                          width: { md: "450px", xs: "100%" },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          px: { md: "50px", xs: "0px" },
                          margin: "auto",
                        }}
                      >
                        {buildLoading ? (
                          <React.Fragment>
                            <Box
                              sx={{
                                height: "273px",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  color: Color.text.secondary,
                                  fontSize: "14px",
                                  mb: "2px",
                                }}
                              >
                                {t("buildAPKPage.building-apk")}
                              </Typography>
                              <Box sx={{ width: "100%" }}>
                                <LinearProgress />
                              </Box>
                            </Box>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Information onAppNameChange={setAppName} />
                            <AppIcon onIconChange={setAppIcon} />
                          </React.Fragment>
                        )}

                        <Button
                          variant="contained"
                          sx={{ mt: 3, width: "150px" }}
                          onClick={() => onCreateNewAPK()}
                          disabled={buildLoading ? true : false}
                        >
                          {buildLoading ? (
                            <CircularProgress size={22} />
                          ) : (
                            t("buildAPKPage.createAPK")
                          )}
                        </Button>
                        <Button
                          sx={{ color: Color.text.primary, mt: 2 }}
                          onClick={() => onBackToMainPanel()}
                        >
                          {t("buildAPKPage.action.prev")}
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "30px",
                        }}
                      >
                        <div>
                          <Typography
                            variant="body1"
                            style={{
                              textAlign: "center",
                              color: Color.text.primary,
                              fontSize: "24px",
                              fontWeight: 300,
                              fontFamily: "Bebas Neue, sans-serif",
                            }}
                          >
                            {t("buildAPKPage.create-apk-option")}
                          </Typography>
                          <Typography
                            variant="body1"
                            style={{
                              textAlign: "center",
                              color: Color.text.secondary,
                              fontSize: "14px",
                              fontWeight: 300,
                            }}
                          >
                            {t("buildAPKPage.create-new-app")}
                          </Typography>
                        </div>

                        <SouthIcon style={arrowStyles} />

                        <Button
                          variant="contained"
                          sx={{
                            width: "150px",
                            bgcolor: Color.background.purple,
                            borderRadius: "5px",
                            "&:hover": {
                              bgcolor: Color.background.purple_gray,
                            },
                          }}
                          onClick={() => onOpenCreatePanel()}
                        >
                          {t("buildAPKPage.open-create-panel")}
                        </Button>
                      </Box>
                    )}
                  </Box>
                  {!createdApk && (
                    <Box sx={{ flex: 1 }}>
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "30px",
                        }}
                      >
                        <div>
                          <Typography
                            variant="body1"
                            style={{
                              textAlign: "center",
                              color: Color.text.primary,
                              fontSize: "24px",
                              fontWeight: 300,
                              fontFamily: "Bebas Neue, sans-serif",
                            }}
                          >
                            {t("buildAPKPage.download-apk-option")}
                          </Typography>
                          {user?.user?.apk == "created" ? (
                            <Typography
                              variant="body1"
                              style={{
                                textAlign: "center",
                                color: Color.text.secondary,
                                fontSize: "14px",
                                fontWeight: 300,
                              }}
                            >
                              {t("buildAPKPage.already-created")}
                            </Typography>
                          ) : (
                            <Typography
                              variant="body1"
                              style={{
                                textAlign: "center",
                                color: Color.text.secondary,
                                fontSize: "14px",
                                fontWeight: 300,
                              }}
                            >
                              {t("buildAPKPage.should-create-apk")}
                            </Typography>
                          )}
                        </div>

                        <SouthIcon style={arrowStyles} />
                        {loading ? (
                          <Typography
                            variant="body1"
                            sx={{ color: Color.text.primary, fontSize: "12px" }}
                          >
                            {" "}
                            {t("buildAPKPage.apk-downloading")}
                          </Typography>
                        ) : (
                          <React.Fragment>
                            <Button
                              variant={user?.user?.apk === "created" ? "contained" : "outlined"}
                              sx={{
                                width: "150px",
                                bgcolor:
                                  user?.user?.apk === "created"
                                    ? Color.background.purple
                                    : undefined,
                                borderRadius: "5px",
                                mt: user?.user?.apk === "created" ? undefined : 3,
                                "&:hover":
                                  user?.user?.apk === "created"
                                    ? { bgcolor: Color.background.purple_gray }
                                    : undefined,
                              }}
                              onClick={() => handleDownloadApk()}
                              disabled={user?.user?.apk !== "created"}
                            >
                              {t("buildAPKPage.open-download-action")}
                            </Button>
                          </React.Fragment>
                        )}
                      </Box>
                    </Box>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Box>
                    <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                      {t("buildAPKPage.waiting-message")}
                    </Typography>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </div>
        </div>
      </Container>
      <style jsx>{`
        @keyframes moveDown {
          0% {
            transform: translateY(-5px);
          }
          50% {
            transform: translateY(5px);
          }
          100% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Grid>
  );
};

export default BuilderAPKContent;
