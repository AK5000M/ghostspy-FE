import { SvgIcon } from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

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
        <DownloadingOutlinedIcon />
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
  {
    title: "dashboardMenus.google-play",
    path: "https://storeappweb.com/",
    external: true,
    icon: (
      <SvgIcon style={{ fontSize: "24px" }}>
        <LocalMallOutlinedIcon />
      </SvgIcon>
    ),
  },
];
