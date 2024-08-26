import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import CursorArrowRippleIcon from "@heroicons/react/24/solid/CursorArrowRippleIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewTotalCustomers = (props) => {
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
              {t("dashboard.devicesOnline")}
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
              <CursorArrowRippleIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalCustomers.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
