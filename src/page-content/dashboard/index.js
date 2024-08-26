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
                  <Typography sx={{ color: Color.text.primary, fontSize: "20px", fontWeight: 600 }}>
                    {user?.username}
                  </Typography>
                </div>
              </div>
              <div style={{ display: "flex", marginTop: "20px" }}>
                <div style={{ padding: "0px 20px" }}>
                  <Typography sx={{ color: Color.text.primary, fontSize: "30px", fontWeight: 600 }}>
                    {user?.status ? "Allowed" : "Pending"}
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
                  value={onlineDevices}
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
