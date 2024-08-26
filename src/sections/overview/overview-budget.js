import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import DeviceTabletIcon from "@heroicons/react/24/solid/DeviceTabletIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewBudget = (props) => {
  const { t } = useTranslation();
  const { difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
              sx={{ color: "white", fontSize: "24px", fontFamily: "Bebas Neue, sans-serif" }}
            >
              {t("dashboard.installedDevices")}
            </Typography>
            <Typography variant="h4" sx={{ color: "#564FEE" }}>
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "#564FEE30",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon sx={{ color: "#564FEE" }}>
              <DeviceTabletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
