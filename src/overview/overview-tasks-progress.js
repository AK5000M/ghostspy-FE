import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";

import { Avatar, Box, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewTasksProgress = (props) => {
  const { t } = useTranslation();
  const { value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography
              color="text.primary"
              gutterBottom
              variant="overline"
              sx={{ color: "white" }}
            >
              {t("dashboard.newDevices")}
            </Typography>
            <Typography variant="h4" sx={{ color: "#564FEE" }}>
              +{value}
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
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}></Box>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
