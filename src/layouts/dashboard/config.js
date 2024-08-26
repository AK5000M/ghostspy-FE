import { SvgIcon } from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";

export const items = [
  {
    title: "dashboardMenus.dashboard",
    path: "/dashboard",
    icon: (
      <SvgIcon style={{ fontSize: "24px" }}>
        <DashboardOutlinedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "dashboardMenus.connectedDevices",
    path: "/devices",
    icon: (
      <SvgIcon style={{ fontSize: "24px" }}>
        <MonitorHeartOutlinedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "dashboardMenus.buildAPK",
    path: "/builder",
    icon: (
      <SvgIcon style={{ fontSize: "24px" }}>
        <DownloadOutlinedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "dashboardMenus.support",
    path: "/support",
    icon: (
      <SvgIcon style={{ fontSize: "24px" }}>
        <HelpCenterOutlinedIcon />
      </SvgIcon>
    ),
  },
];
