import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

export const OverviewTotalProfit = (props) => {
  const { t } = useTranslation();
  const { value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline" sx={{ color: "white" }}>
              {t("dashboard.systemStatus")}
            </Typography>
            <Typography variant="h4" sx={{ color: "#564FEE" }}>
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "text.primary",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <BarChartIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
